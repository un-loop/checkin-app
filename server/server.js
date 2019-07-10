const path = require('path');
const koa = require('koa');
const mount = require('koa-mount');
const body = require('koa-bodyparser');
const query = require('unloop-koa-query');
const decode = require('koa-decode-params');
const cryptKey = process.env.npm_config_cryptKey || process.env.cryptKey;
const crypt = require('unloop-crypt')(cryptKey);
const Auth = require('koa-auth-wrapper');
const context = require('koa-user-context');
const session = require('unloop-auth-session');
const resourceBuilder = require('unloop-resource-builder')(__dirname);
const staticRouter = require('unloop-static-router')( path.resolve(__dirname, "../client"),
[
    {
        route: '/',
        permissions: ['admin']}
    ,
    {
        route: '/admin',
        permissions: ['admin']
    },
    {
        route: '/check-in',
        permissions: ['admin']
    },
    {
        route: '/image',
        permissions: []
    }
]
);

const userEntity = require("./entity/users");
const credentialEntity = require("./entity/credentials");
const profileEntity = require("./entity/profiles")

const builderWithMiddleware = resourceBuilder(query(), decode());

const events = builderWithMiddleware('events');
const attendees = builderWithMiddleware('attendees');
const users = builderWithMiddleware('users');
const credentials = builderWithMiddleware('credentials');
const profiles = builderWithMiddleware('profiles');
events.add(attendees);
users.add(credentials);
users.add(profiles);

const koaApi = new koa();
koaApi.use(events.middleware());
koaApi.use(users.middleware());

const koaApp = new koa();

koaApp.use(body());

koaApp.use(session(koaApp, cryptKey));
koaApp.use(context( (user) => ({ // payload must hold only UI concerns, this is exposed to the browser and is not secure
        username: user ? user.username : "",
        name: user ?  user.name : "",
        isAdmin: user ? user.roles.findIndex((item) => item === "super" || item === "admin" ) !== -1 : false,
        isLoggedIn: Boolean(user)
    })
))

const auth = new Auth({
    encrypt: crypt.encrypt,
    decrypt: crypt.decrypt,
    localStrategy: async (username, password) => {
        const credentials = await credentialEntity.table.unsafeGet(username);
        if (!await credentialEntity.validatePassword(password)(credentials)) {
            return false;
        }

        credentialEntity.sanitize(credentials); // remove password
        const user = await userEntity.table.get(credentials.userId);
        const profile = await profileEntity.table.get(credentials.userId);
        return Object.assign(credentials, user, profile); // join tables
    },
    changePassword: async (user, password, newPassword) => {
        const credentials = await credentialEntity.table.unsafeGet(user.username);
        if (!await credentialEntity.validatePassword(password)(credentials)) {
            return false;
        }

        credentials.expiration = process.env.npm_package_config_passwordExpirationDays && process.env.npm_package_config_passwordExpirationDays != "0" ?
            now.setDate(
                now.getDate() + Number(process.env.npm_package_config_passwordExpirationDays)
            ) : undefined;
        credentials.password = newPassword;
        await credentialEntity.hashPassword(credentials);
        return await credentialEntity.table.unsafeUpdate(credentials);
    },
    changeAccountDetails: async (user, details, password) => {
        const credentials = await credentialEntity.table.unsafeGet(user.username);
        if (!await credentialEntity.validatePassword(password)(credentials)) {
            return false;
        }

        Object.assign(credentials, details);

        //need to wrap in transaction
        await credentialEntity.table.create(credentials);
        await credentialEntity.table.delete(user.username);

        return true;
    }
});

koaApp.use(auth.middleware());
koaApp.use(mount('/api', koaApi));
koaApp.use(staticRouter(koaApp));

koaApp.listen(process.env.PORT || 3000);
