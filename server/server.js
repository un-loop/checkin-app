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

const builderWithMiddleware = resourceBuilder(query(), decode());

const events = builderWithMiddleware('events');
const attendees = builderWithMiddleware('attendees');
const users = builderWithMiddleware('users');
events.add(attendees);

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

const mergeUser = (merge) => (user) => user ? Object.assign(user, merge) : user;
const getUsername = async (username) =>
    {
        const queryObj = query.Query.GetKeyedQuery(username).set_index("username");
        const result = await userEntity.table.unsafeQuery(queryObj);
        return result ? result[0] : result;
    }

const auth = new Auth({
    encrypt: crypt.encrypt,
    decrypt: crypt.decrypt,
    localStrategy: async (username, password) =>
        getUsername(username)
        .then(userEntity.validatePassword(password))
        .then(userEntity.sanitize),
    changePassword: async (user, password, newPassword) =>
        userEntity.table.unsafeGet(user.userId)
        .then(userEntity.validatePassword(password))
        .then((result) => {
                let now = new Date();
                return result ?
                {...result,
                    expiration: process.env.npm_package_config_passwordExpirationDays && process.env.npm_package_config_passwordExpirationDays != "0" ?
                        now.setDate(
                            now.getDate() + Number(process.env.npm_package_config_passwordExpirationDays)
                        ) : undefined,
                    password: newPassword
                } : {}
            })
        .then(userEntity.hashPassword)
        .then(userEntity.table.unsafeUpdate),
    changeAccountDetails: async (user, details, password) =>
        userEntity.table.unsafeGet(user.userId)
        .then(userEntity.validatePassword(password))
        .then(mergeUser(details))
        .then(userEntity.table.update)
});

koaApp.use(auth.middleware());
koaApp.use(mount('/api', koaApi));
koaApp.use(staticRouter(koaApp));

koaApp.listen(process.env.PORT || 3000);
