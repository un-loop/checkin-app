const dbContext = require('../dbcontext');
const Table =
  require('unloop-database-dynamo')(dbContext.db, dbContext.docClient);

const key = 'userId';

exports.key = key;

exports.schema = {
  TableName: 'Profile',
  BillingMode: 'PROVISIONED',
  KeySchema: [
    {AttributeName: key, KeyType: 'HASH'},
  ],
  AttributeDefinitions: [
    {AttributeName: key, AttributeType: 'S'},
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

exports.initialData =
    [
      {
        userId: '19495e34-7e7b-495d-a880-6cd5aafe5a9c',
        name: 'Unloop Administrator',
      },
    ];

exports.table = new Table(module.exports);
