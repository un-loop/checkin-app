const bcrypt = require("bcrypt");
const { v4 } = require("uuid");
const dbContext = require("../dbcontext");
const Table = require("unloop-database-dynamo")(dbContext.db, dbContext.docClient);

const key = "userId";

exports.key = key;
exports.indexKey = {
    "username": "username"
}

exports.schema =  {
    TableName : "User",
    BillingMode: "PROVISIONED",
    KeySchema: [
        { AttributeName: key, KeyType: "HASH"}
    ],
    AttributeDefinitions: [
            { AttributeName: key, AttributeType: "S" },
            { AttributeName: "username", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: 'username',
            KeySchema: [
                { AttributeName: "username", KeyType: "HASH" }
            ],
            Projection: {
                ProjectionType: "ALL"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

exports.initialData = () => hashPassword("changeme").then(
    hash => [
        {
            userId: v4(),
            username: "admin@un-loop.org",
            name: "Unloop Administrator",
            password: hash,
            expiration: (new Date()).toISOString(),
            roles: ["super", "user"]
        }
    ]
);

const hashPassword = (password) =>
    new Promise(
        (resolve, reject) => {
            if (password === undefined) {
                return resolve(undefined);
            }

            bcrypt.hash(password, Number(process.env.npm_package_config_saltRounds),
                (err, hash) => {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve(hash);
                    }
                });
        }
    );

const validatePassword = (password) => (user) =>
    user ? new Promise(
        (resolve, reject) =>
            bcrypt.compare(password, user.password, (err, res) => err ? reject(err) : resolve(res ? user : res))
    ) :
    Promise.resolve(false);

exports.hashPassword = (user) => hashPassword(user.password).then(hash => {
    if (hash) user.password = hash;
    return user;
});

exports.validatePassword = validatePassword;

const sanitizeUser = (user) => {
    if (user) {
        delete user.password;
    }

    return user;
};

exports.sanitize = sanitizeUser;

exports.table = new Table(this);
