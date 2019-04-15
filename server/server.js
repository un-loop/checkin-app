const path = require('path');
const koa = require('koa');
const mount = require('koa-mount');
const body = require('koa-bodyparser');
const query = require('unloop-koa-query');
const decode = require('koa-decode-params');
const cryptKey = process.env.npm_config_cryptKey;
const crypt = require('unloop-crypt')(cryptKey);
const Auth = require('koa-auth-wrapper');

const session = require('./session');
const userEntity = require("./entity/users");
const context = require('./user-context');
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

const auth = new Auth({
    login: "/login",
    logout: "/logout",
    encrypt: crypt.encrypt,
    decrypt: crypt.decrypt,
    localStrategy: async (username, password) =>
        userEntity.table.get(username).then(userEntity.validatePassword(password))
});

koaApp.use(auth.middleware());
koaApp.use(mount('/api', koaApi));
koaApp.use(staticRouter(koaApp));

koaApp.listen(3000);
