const ResultCodes = require("../resultCodes");
const { v4 } = require("uuid");

const table = require("../database");
const attendees = new table(this);

exports.schema =  {
    TableName : "Attendee",
    BillingMode: "PROVISIONED",
    KeySchema: [
        { AttributeName: "eventId", KeyType: "HASH"},
        { AttributeName: "checkin", KeyType: "RANGE" }
    ],
    AttributeDefinitions: [
            { AttributeName: "eventId", AttributeType: "S" },
            { AttributeName: "checkin", AttributeType: "S" }
        ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

exports.key = "eventId";
exports.rangeKey = "attendeeId";

exports.index = function *(next) {
    yield next;
    this.body = this.dbQuery ?
        yield attendees.query(this.dbQuery.isOrdered ? this.dbQuery : this.dbQuery.order(false)) :
        yield attendees.getAll();
}

exports.show = function *(next) {
    yield next;
    var result = yield attendees.get(this.params.event, this.params.attendee);

    if (!result) {
        this.status = ResultCodes.NotFound;
        this.body = 'Not Found';
    } else {
        this.body = result;
    }
}

exports.create = function *(next) {
    yield next;
    if (!this.request.body || !this.params.event || !this.request.body.checkin || !this.request.body.name) this.throw(ResultCodes.BadRequest, 'eventId, .checkin, .name required');
    let attendee = (({ name, organization, email, phone, optIn, checkin }) => ({ name, organization, email, phone, optIn, checkin }))(this.request.body);
    attendee.eventId = this.params.event;
    attendee.attendeeId = v4();
    yield attendees.create(attendee);
    this.status = ResultCodes.Created;
    this.body = JSON.stringify(attendee);
}

exports.update = function *(next) {
    yield next;
    if (!this.request.body || !this.params.event || !this.request.body.checkin || !this.request.body.name || !this.params.attendee) this.throw(ResultCodes.BadRequest, 'eventId, attendeeId, .checkin, .name required');
    if (!this.request.body || !this.request.body.eventId || !this.request.body.checkin) this.throw(ResultCodes.BadRequest, '.eventId, .checkin required');

    let attendee = (({ eventId, attendeeId, name, organization, email, phone, optIn, checkin } ) => ({ eventId, attendeeId, name, organization, email, phone, optIn, checkin }))(this.request.body);
    yield attendees.update(attendee, this.params.event, this.params.attendee);
    this.status = ResultCodes.Success;
    this.body = JSON.stringify(attendee);
}

exports.destroy = function *(next) {
    yield next;
    if (!this.params.event || !this.params.attendee) this.throw(ResultCodes.BadRequest, 'eventId, attendeeId required');

    yield attendees.delete(this.params.event, this.params.attendee);
    this.status = ResultCodes.Success;
    this.body = JSON.stringify(attendee);
}
