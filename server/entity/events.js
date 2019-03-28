const dbContext = require("../dbcontext");
const Table = require("unloop-database-dynamo")(dbContext.db, dbContext.docClient);

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

exports.table = new Table(this);
