const {v4} = require('uuid');
const ResultCodes =require('../resultCodes');

/* eslint-disable require-atomic-updates */
module.exports = (entity) => {
  const users = entity.table;

  return {
    index: async function(ctx, next) {
      await next();

      const query = ctx.dbQuery && ctx.dbQuery.isOrdered ?
        ctx.dbQuery : ctx.dbQuery.order(true);

      const profiles = ctx.dbQuery ?
        await profiles.query(query) :
        await profiles.getAll();

      ctx.body = users;
    },
    show: async function(ctx, next) {
      await next();

      if (!ctx.params.user) {
        ctx.throw(ResultCodes.BadRequest, 'userId required');
      }

      const result = await users.get(ctx.params.userId);

      if (!result) {
        ctx.status = ResultCodes.NotFound;
        ctx.body = 'Not Found';
      } else {
        ctx.body = result;
      }
    },
    create: async function(ctx, next) {
      await next();
      if (!ctx.request.body || !ctx.request.body.roles) {
        ctx.throw(ResultCodes.BadRequest, '.roles required');
      }
      const user = (({roles}) => ({userId: v4(), roles}))(ctx.request.body);

      await users.create(user)
          .then( (user) => {
            ctx.status = ResultCodes.Created;
            ctx.body = JSON.stringify(user);
          }, (err) => {
            ctx.status = ResultCodes.Error;
            ctx.body = 'Failed to create user';
          });
    },
    update: async function(ctx, next) {
      await next();
      if (!ctx.params.user) {
        ctx.throw(ResultCodes.BadRequest, 'userId required');
      }

      if (!ctx.request.body || !ctx.request.body.roles) {
        ctx.throw(ResultCodes.BadRequest, '.roles required');
      }

      const user = (({roles}) =>
        ({userId: ctx.params.user, roles}))(ctx.request.body);

      await users.update(user)
          .then( (user) => {
            ctx.status = ResultCodes.Created;
            ctx.body = JSON.stringify(user);
          }, (err) => {
            ctx.status = ResultCodes.Error;
            ctx.body = 'Failed to create user';
          });
    },
    destroy: async function(ctx, next) {
      await next();
      if (!ctx.params.user) {
        ctx.throw(ResultCodes.BadRequest, 'userId required');
      }

      await users.delete(ctx.params.user)
          .then(
              () => {
                ctx.status = ResultCodes.Success;
                ctx.body = 'Deleted';
              }, (err) => {
                ctx.status = ResultCodes.Error;
                ctx.body = 'Failed to delete user';
              }
          );
    },
  };
};

module.exports.permissions = {
  default: ['admin'],
};
