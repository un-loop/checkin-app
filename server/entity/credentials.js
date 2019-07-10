const bcrypt = require("bcrypt");
const dbContext = require("../dbcontext");
const Table = require("unloop-database-dynamo")(dbContext.db, dbContext.docClient);

const key = "username";

exports.key = key;

exports.schema =  {
    TableName : "Credential",
    BillingMode: "PROVISIONED",
    KeySchema: [
        { AttributeName: key, KeyType: "HASH"}
    ],
    AttributeDefinitions: [
            { AttributeName: key, AttributeType: "S" },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

exports.initialData = () => hashPassword("changeme").then(
    hash => [
        {
            userId: "19495e34-7e7b-495d-a880-6cd5aafe5a9c",
            username: "admin@un-loop.org",
            password: hash,
            expiration: (new Date()).toISOString(),
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

const validatePassword = (password) => (credentials) =>
    credentials ? new Promise(
        (resolve, reject) =>
            bcrypt.compare(password, credentials.password, (err, res) => err ? reject(err) : resolve(res ? credentials : res))
    ) :
    Promise.resolve(false);

exports.hashPassword = (credentials) => hashPassword(credentials.password).then(hash => {
    if (hash) credentials.password = hash;
    return credentials;
});

exports.validatePassword = validatePassword;

const sanitizeCredentials = (credentials) => {
    if (credentials) {
        delete credentials.password;
    }

    return credentials;
};

exports.sanitize = sanitizeCredentials;

exports.table = new Table(this);
