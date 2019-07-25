const userEntity = require("./entity/users");
const credentialEntity = require("./entity/credentials");
const profileEntity = require("./entity/profiles");

module.exports = async (credentials) => {
    credentialEntity.sanitize(credentials); // remove password
    const user = await userEntity.table.get(credentials.userId);
    const profile = await profileEntity.table.get(credentials.userId);
    return Object.assign(credentials, user, profile); // join tables
}
