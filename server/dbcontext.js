const AWS= require("aws-sdk");

const config = {
    maxRetries: 1,
    httpOptions: { timeout: 30000, connectTimeout: 15000 }
};

module.DbContext = class {
    constructor(
        endpoint = process.env.npm_package_config_dynamoEndpoint,
        region = process.env.npm_package_config_dynamoRegion
    ) {
        let options = { endpoint: endpoint || "" };
        if (region) {
            options["region"] = region;
        }

        AWS.config.update(options, true);
        this.db = new AWS.DynamoDB(config);
        this.docClient = new AWS.DynamoDB.DocumentClient(config);
    }
}

const endpoint = process.env.NODE_ENV === "production" ? process.env.npm_package_config_dynamoEndpoint :
                                                         "http://localhost:8000";

module.exports = new module.DbContext(endpoint, process.env.npm_package_config_dynamoRegion);
