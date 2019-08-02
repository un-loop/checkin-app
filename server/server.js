const path = require('path');
const Koa = require('koa');
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
const credentialEntity = require('./entity/credentials');
const getUserContext = require('./getUserContext');
const ResultCodes = require('./resultCodes');
const errorPage = require('./errorPage');
const StatusRouter = require('koa-status-router');
const StaticRouter = require('unloop-static-router');

const builderWithMiddleware = resourceBuilder(query(), decode());

const events = builderWithMiddleware('events');
const attendees = builderWithMiddleware('attendees');
const users = builderWithMiddleware('users');
const credentials = builderWithMiddleware('credentials');
const profiles = builderWithMiddleware('profiles');
events.add(attendees);
users.add(credentials);
users.add(profiles);

const koaApi = new Koa();
koaApi.use(events.middleware());
koaApi.use(users.middleware());

const koaApp = new Koa();

koaApp.use(body());

koaApp.use(session(koaApp, cryptKey));
koaApp.use(context( (user) => (
  {// payload must hold only UI concerns,
  // this is exposed to the browser and is not secure
    username: user ? user.username : '',
    name: user ? user.name : '',
    isAdmin: user && user.roles ?
      user.roles.findIndex((item) => item === 'super' || item === 'admin')
      !== -1
      : false,
    isLoggedIn: Boolean(user),
    userId: user ? user.userId : '',
  })
));

const auth = new Auth({
  encrypt: crypt.encrypt,
  decrypt: crypt.decrypt,
  localStrategy: async (username, password) => {
    const context = await credentialEntity.table.unsafeGet(username);
    if (!await credentialEntity.validatePassword(password)(context)) {
      return false;
    }

    await getUserContext(context);

    return context;
  },
  updateUser: async (u) => {
    const userId = u.userId;
    const tmpQuery =
      query.Query.GetKeyedQuery(userId) // eslint-disable-line new-cap
          .withIndex(credentialEntity.userIdQuery);
    const credentials = await credentialEntity.table.query(tmpQuery);

    if (!credentials || !credentials.length) {
      return false;
    }

    const context = credentials[0];
    await getUserContext(context);

    return context;
  },
  changePassword: async (user, password, newPassword) => {
    const credentials = await credentialEntity.table.unsafeGet(user.username);
    if (!await credentialEntity.validatePassword(password)(credentials)) {
      return false;
    }

    credentials.expiration =
      process.env.npm_package_config_passwordExpirationDays
      && process.env.npm_package_config_passwordExpirationDays != '0' ?
        now.setDate(
            now.getDate() +
            Number(process.env.npm_package_config_passwordExpirationDays)
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

    // TODO: wrap in transaction
    await credentialEntity.table.create(credentials);
    await credentialEntity.table.delete(user.username);

    return true;
  },
});

koaApp.use(auth.middleware());
koaApp.use(mount('/api', koaApi));

const statusRouter = new StatusRouter();
const staticRouter = new StaticRouter({
  root: path.resolve(__dirname, '../client'),
  routes: [
    {
      route: '/',
      permissions: ['admin'],
    },
    {
      route: '/admin',
      permissions: ['admin'],
    },
    {
      route: '/check-in',
      permissions: ['admin'],
    },
    {
      route: '/image',
      permissions: [],
    },
  ],
});

statusRouter.all(ResultCodes.NotFound, errorPage);
statusRouter.all(ResultCodes.Forbidden, errorPage);
statusRouter.all(ResultCodes.Error, errorPage);
staticRouter.use(statusRouter.middleware());
koaApp.use(staticRouter.middleware());

koaApp.listen(process.env.PORT || 3000);
