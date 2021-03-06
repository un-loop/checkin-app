const dbContext = require('../dbcontext');
const Table =
  require('unloop-database-dynamo')(dbContext.db, dbContext.docClient);

const key = 'eventId';
const rangeKey = 'attendeeId';

exports.key = key;
exports.rangeKey = rangeKey;

exports.indexKey = {
  attendeeCheckinOrder: key,
};

exports.schema = {
  TableName: 'Attendee',
  BillingMode: 'PROVISIONED',
  KeySchema: [
    {AttributeName: key, KeyType: 'HASH'},
    {AttributeName: rangeKey, KeyType: 'RANGE'},
  ],
  AttributeDefinitions: [
    {AttributeName: key, AttributeType: 'S'},
    {AttributeName: rangeKey, AttributeType: 'S'},
    {AttributeName: 'checkin', AttributeType: 'S'},
  ],
  LocalSecondaryIndexes: [
    {
      IndexName: 'attendeeCheckinOrder',
      KeySchema: [
        {AttributeName: key, KeyType: 'HASH'},
        {AttributeName: 'checkin', KeyType: 'RANGE'},
      ],
      Projection: {
        ProjectionType: 'INCLUDE',
        NonKeyAttributes: ['name'],
      },
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

exports.table = new Table(module.exports);
