const ResultCodes =require('../resultCodes');
const {v4} = require('uuid');

/* eslint-disable require-atomic-updates */
module.exports = (entity) => {
  const events = entity.table;

  return {
    index: async function(ctx, next) {
      await next();
      let query = ctx.dbQuery;
      if (query && !ctx.dbQuery.isOrdered) {
        query = query.order(true);
      }

      ctx.body = ctx.dbQuery ?
        await events.query(query) :
        await events.getAll();
    },
    show: async function(ctx, next) {
      await next();
      if (!ctx.params.event) {
        ctx.throw(ResultCodes.BadRequest, 'eventId required');
      }
      const result = await events.get(ctx.params.event);

      if (!result) {
        ctx.status = ResultCodes.NotFound;
        ctx.body = 'Not Found';
      } else {
        ctx.body = result;
      }
    },
    create: async function(ctx, next) {
      await next();
      if (!ctx.request.body || !ctx.request.body.name ||
        !ctx.request.body.start) {
        ctx.throw(ResultCodes.BadRequest, '.name, .start required');
      }
      const event = (({name, start}) => ({name, start}))(ctx.request.body);
      event.eventId = v4();
      await events.create(event);
      ctx.status = ResultCodes.Created;
      ctx.body = JSON.stringify(event);
    },
    update: async function(ctx, next) {
      await next();
      if (!ctx.params.event) {
        ctx.throw(ResultCodes.BadRequest, 'eventId required');
      }
      if (!ctx.request.body || !ctx.request.body.eventId ||
        !ctx.request.body.name || !ctx.request.body.start) {
        ctx.throw(ResultCodes.BadRequest, '.eventId, .name, .start required');
      }

      const event = (({eventId, name, start, started}) =>
        ({eventId, name, start, started}))(ctx.request.body);
      await events.update(event, ctx.params.event);
      ctx.status = ResultCodes.Success;
      ctx.body = JSON.stringify(event);
    },
    destroy: async function(ctx, next) {
      await next();
      if (!ctx.params.event) {
        ctx.throw(ResultCodes.BadRequest, 'eventId required');
      }
      await events.delete(ctx.params.event);
      ctx.status = ResultCodes.Success;
      ctx.body = 'Deleted';
    },
  };
};

module.exports.permissions = {
  default: ['admin'],
};
