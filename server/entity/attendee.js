const dbContext = require("../dbcontext");
const Table = require("unloop-database-dynamo")(dbContext.db, dbContext.docClient);

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

exports.table = new Table(this);
