const dbContext = require("./dbcontext")

function tableExists() {
    let param = {
        TableName: this.schema.TableName
    };

    return Promise.resolve().then( () =>
        new Promise((resolve, reject) => {
            dbContext.db.describeTable(param, (err, data) =>
                (err) ? reject(err) : resolve(data)
            );
        }
    ));
}

function createTable() {
    return Promise.resolve().then( () =>
        new Promise((resolve, reject ) => {
            dbContext.db.createTable(this.schema, (err, data) =>
                err ? reject(err) : resolve(data)
            );
        }));
}

async function ensureTable() {
    var first = tableExists.bind(this);
    var second = createTable.bind(this);

    await first().catch( (err) => {
        return second();
    });
}

function getUpdateProperties(entity) {
    let map = {};

    let count = 0;
    for (let prop in entity) {
        if ([this.key, this.rangeKey].indexOf(prop) >= 0) continue;
        let param = "#p" + count;
        let value = ":v" + count++;
        map[prop] = {
            param: param,
            valueParam: value,
            value: entity[prop]
        };
    }

    return map;
}

function getUpdateExpression(map) {
    let assignment = [];

    for (let prop in map) {
        assignment.push(map[prop].param + " = " + map[prop].valueParam);
    }

    if (!assignment.length) {
        return "";
    }

    return "set " + assignment.join(", ");
}

function getUpdateItemInput(entity, partitionKey, sortKey) {
    let key = {
        [this.key]: partitionKey
    };

    if (sortKey) {
        key[this.rangeKey] = sortKey;
    }

    let result = {
        TableName: this.schema.TableName,
        Key: key
    };

    let map = getUpdateProperties.call(this, entity);
    result.UpdateExpression = getUpdateExpression.call(this,map);
    if (!result.UpdateExpression) return undefined;

    result.ExpressionAttributeValues = {};
    result.ExpressionAttributeNames = {};

    for (let prop in map) {
        result.ExpressionAttributeNames[map[prop].param] = prop;
        result.ExpressionAttributeValues[map[prop].valueParam] =
            map[prop].value;
    }

    return result;
}

async function getAll() {
    let params = {
        TableName: this.schema.TableName
    };

    let promise = new Promise((resolve, reject) => {
        dbContext.docClient.scan(params, (err, data) => {
            if (err) {
                return reject(err);
            } else {
                if (!data.Items || !data.Count) {
                    return resolve([]);
                } else {
                    return resolve(data.Items);
                }
            }
        });
    });

    return promise;
}

async function get(partitionKey, sortKey = undefined) {
    let key = {
        [this.key]: partitionKey
    };

    if (sortKey) {
        key[this.rangeKey] = sortKey;
    }

    let params = {
        TableName: this.schema.TableName,
        Key: key
    };

    let promise = new Promise((resolve, reject) => {
        dbContext.docClient.get(params, (err, data) => {
            if (err) {
                return reject(err);
            } else {
                if (!data.Item) {
                    return resolve(undefined);
                } else {
                    return resolve(data.Item);
                }
            }
        });
    });

    return promise;
}

async function create(entity) {

    let projection = {};
    for(let prop in entity) if (entity[prop]) projection[prop] = entity[prop];

    let params = {
        TableName: this.schema.TableName,
        Item: projection
    };

    let promise = new Promise((resolve, reject) => {
        dbContext.docClient.put(params, (err) =>
             err ? reject(err) : resolve(entity));
    });

    return promise;
}

async function update(
    entity,
    partitionKey,
    sortKey = undefined
) {
    let key = {
        [this.key]: partitionKey
    };

    if (sortKey) {
        key[this.rangeKey] = sortKey;
    }

    let params = getUpdateItemInput.call(this,
        entity,
        partitionKey,
        sortKey
    );

    let promise = params ?
        new Promise((resolve, reject) => {

        dbContext.docClient.update(
            params,
            (err) => err ? reject(err) : resolve(entity)
        );
    }) : Promise.resolve(undefined);

    return promise;
}

async function remove(partitionKey, sortKey = undefined) {
    let key = {
        [this.key]: partitionKey
    };

    if (sortKey) {
        key[this.rangeKey] = sortKey;
    }

    let params = {
        TableName: this.schema.TableName,
        Key: key
    };

    let promise = new Promise((resolve, reject) => {
        dbContext.docClient.delete(params, (err) =>
            err ? reject(err) : resolve()
        );
    });

    return promise;
}

async function query(query) {
    return await query.partitionKey ? dbQuery.call(this, query) : inMemoryQuery.call(this, query);
}

async function dbQuery(query) {
    let params = {
        TableName: this.schema.TableName,
        KeyConditionExpression: "#key = :value",
        ExpressionAttributeNames: {
            "#key": this.key
        },
        ExpressionAttributeValues: {
            ":value": query.partitionKey
        }
    };

    if (query.isOrdered !== undefined)
        params["ScanIndexForward"] = query.isOrdered;
    if (query.max) params["Limit"] = query.max;

    let promise = new Promise((resolve, reject) => {
        dbContext.docClient.query(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                if (!data.Items || !data.Count) {
                    resolve([]);
                } else {
                    resolve(data.Items);
                }
            }
        });
    });

    return promise;
}

async function inMemoryQuery(query) {
    let params = {
        TableName: this.schema.TableName
    };

    let promise = new Promise((resolve, reject) => {
        dbContext.docClient.scan(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                if (!data.Items || !data.Count) {
                    resolve([]);
                } else {
                    let result = data.Items
                    .sort( (first, second) => {
                        var result = 0;
                        if ( first[query.orderby] > second[query.orderby]) result = 1;
                        if ( second[query.orderby] > first[query.orderby]) result = -1;

                        if (query.isOrdered === false) result *= -1;

                        return result;
                    });

                    if (query.limit) result = result.slice(0, query.max);

                    resolve(result);
                }
            }
        });
    });

    return promise;
}

function safeOp(table, asyncCallback) {
    return async function() {
        await ensureTable.call(table);
        return await asyncCallback.apply(table, arguments);
    }
}

module.exports = function(table) {
        this.getAll = safeOp(table, getAll);
        this.get = safeOp(table, get);
        this.create = safeOp(table, create);
        this.update = safeOp(table, update);
        this.delete = safeOp(table, remove);
        this.query = safeOp(table, query);
}
