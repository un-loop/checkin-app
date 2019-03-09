const ResultCodes =require("../resultCodes");
const { v4 } = require("uuid");
const bcrypt = require("bcrypt");

const table = require("../database");
const users = new table(this);

exports.schema =  {
    TableName : "User",
    BillingMode: "PROVISIONED",
    KeySchema: [
        { AttributeName: "username", KeyType: "HASH"}
    ],
    AttributeDefinitions: [
            { AttributeName: "username", AttributeType: "S" },
        ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

exports.key = "username";

exports.index = function *(next) {
    yield next;
    this.body = this.dbQuery ?
        yield users.query(this.dbQuery.isOrdered ? this.dbQuery : this.dbQuery.order(true)) :
        yield users.getAll();
};

exports.show = function *(next) {
    yield next;
    if (!this.params.user) this.throw(ResultCodes.BadRequest, 'username required');
    var result = yield users.get(this.params.user);

    if (!result) {
        this.status = ResultCodes.NotFound;
        this.body = 'Not Found';
    } else {
        this.body = result;
    }
};


function hashPassword(user) {
    return new Promise(
        (resolve, reject) => {
            bcrypt.hash(user.password,  process.env.npm_package_config_saltRounds,
                (err, hash) => {
                    if (err) {
                        return reject(err);
                    } else {
                        user.password = hash;
                        return resolve(user);
                    }
                });
        }
    );
}

exports.create = function *(next) {
    yield next;
    if (!this.request.body || !this.request.body.username || !this.request.body.password) this.throw(ResultCodes.BadRequest, '.username, .password required');
    let user = (({ username, password }) => ({ username, password }))(this.request.body);

    yield hashPassword(user)
        .then(users.create)
        .then( (user) => {
            this.status = ResultCodes.Created;
            this.body = JSON.stringify(user);
        }, (err) => {
            this.status = ResultCodes.Error;
            this.body = "Failed to create user";
        });
};

exports.update = function *(next) {
    yield next;
    if (!this.params.user) this.throw(ResultCodes.BadRequest, 'username required');
    if (!this.request.body || !this.request.body.password) this.throw(ResultCodes.BadRequest, '.password required');

    let user = (({ password }) => ({ username: this.params.user, password }))(this.request.body);

    yield hashPassword(user)
        .then(users.update)
        .then( (user) => {
            this.status = ResultCodes.Created;
            this.body = JSON.stringify(user);
        }, (err) => {
            this.status = ResultCodes.Error;
            this.body = "Failed to create user";
        });

    yield events.update(event, this.params.event);
    this.status = ResultCodes.Success;
    this.body = JSON.stringify(event);
}

exports.destroy = function *(next) {
    yield next;
    if (!this.params.user) this.throw(ResultCodes.BadRequest, 'username required');

    yield events.delete(this.params.user);
    this.status = ResultCodes.Success;
    this.body = "Deleted";
  }
