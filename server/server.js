const path = require('path');
const koa = require('koa');
const mount = require('koa-mount');
const serve = require('koa-static');
const body = require('koa-bodyparser');
const convert = require('koa-convert');
const nestedRouter = require('koa-recursive-resource-router');
const query = require('unloop-koa-query');
const decode = require('koa-decode-params');
const session = require('./session')
const auth = require('./koa-authorize')
const resourceBuilder = require('./resource-builder')(__dirname);

const queryMiddleware = convert.back(query());
const decodeMiddleware = convert.back(decode());
const builderWithMiddleware = resourceBuilder(decodeMiddleware, queryMiddleware);

const events = builderWithMiddleware('events');
const attendees = builderWithMiddleware('attendees');
const users = builderWithMiddleware('users');
events.add(attendees);

const koaApi = new koa();
koaApi.use(nestedRouter(events));
koaApi.use(users.middleware());

const koaApp = new koa();

koaApp.use(body());

koaApp.use(session(koaApp));
koaApp.use(auth(koaApp));
koaApp.use(mount('/api', koaApi));

koaApp.use(serve(path.resolve(__dirname, "../client")));

koaApp.listen(3000);
