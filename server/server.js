const koa = require('koa');
const mount = require('koa-mount');
const serve = require('koa-static');
const Resource = require('koa-resource-router');
const path = require('path');
const body = require('koa-bodyparser');
const decode = require('koa-decode-params')
const wrapper = require('koa-middleware-wrapper');
const nestedRouter = require('koa-recursive-resource-router');
const query = require('./query');
const session = require('./session')
const auth = require('./koa-authorize')


const bodyMiddleware = wrapper(body()); //need to wrap because koa-resource-router expects a generator pattern
                                        //middleware, whereas koa-bodyparser provides an async pattern
const queryMiddleware = wrapper(query());
const decodeMiddleware = wrapper(decode());
const events = new Resource('events', decodeMiddleware, queryMiddleware, require('./resources/events'));
const attendees = new Resource('attendees', decodeMiddleware,queryMiddleware, require('./resources/attendees'));
events.add(attendees);

const koaApi = new koa();
koaApi.use(nestedRouter(events));

const koaApp = new koa();

koaApp.use(body());

koaApp.use(session(koaApp));
koaApp.use(auth(koaApp));
koaApp.use(mount('/api', koaApi));

koaApp.use(serve(path.resolve(__dirname, "../client")));

koaApp.listen(3000);
