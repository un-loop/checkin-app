const ResultCodes =require("../resultCodes");
const { v4 } = require("uuid");

const table = require("../database");
const events = new table(this);

exports.schema =  {
    TableName : "Event",
    BillingMode: "PROVISIONED",
    KeySchema: [
        { AttributeName: "eventId", KeyType: "HASH"}
    ],
    AttributeDefinitions: [
            { AttributeName: "eventId", AttributeType: "S" },
        ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

exports.key = "eventId";

exports.index = function *(next) {
    yield next;
    this.body = this.dbQuery ?
        yield events.query(this.dbQuery.isOrdered ? this.dbQuery : this.dbQuery.order(true)) :
        yield events.getAll();
};

exports.show = function *(next) {
    yield next;
    if (!this.params.event) this.throw(ResultCodes.BadRequest, 'eventId required');
    var result = yield events.get(this.params.event);

    if (!result) {
        this.status = ResultCodes.NotFound;
        this.body = 'Not Found';
    } else {
        this.body = result;
    }
};

exports.create = function *(next) {
    yield next;
    if (!this.request.body || !this.request.body.name || !this.request.body.start) this.throw(ResultCodes.BadRequest, '.name, .start required');
    let event = (({ name, start }) => ({ name, start }))(this.request.body);
    event.eventId = v4();
    yield events.create(event);
    this.status = ResultCodes.Created;
    this.body = JSON.stringify(event);
};

exports.update = function *(next) {
    yield next;
    if (!this.params.event) this.throw(ResultCodes.BadRequest, 'eventId required');
    if (!this.request.body || !this.request.body.eventId || !this.request.body.name || !this.request.body.start) this.throw(ResultCodes.BadRequest, '.eventId, .name, .start required');

    let event = (({ eventId, name, start, started }) => ({ eventId, name, start, started }))(this.request.body);
    yield events.update(event, this.params.event);
    this.status = ResultCodes.Success;
    this.body = JSON.stringify(event);
}

exports.destroy = function *(next) {
    yield next;
    if (!this.params.event) this.throw(ResultCodes.BadRequest, 'eventId required');

    yield events.delete(this.params.event);
    this.status = ResultCodes.Success;
    this.body = "Deleted";
  }
