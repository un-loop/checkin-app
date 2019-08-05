const ResultCodes =require('../resultCodes');

/* eslint-disable require-atomic-updates */
module.exports = (entity) => {
  const credentials = entity.table;

  return {
    index: async function(ctx, next) {
      await next();
      let query = ctx.dbQuery;
      if (query && !ctx.dbQuery.isOrdered) {
        query = query.order(true);
      }

      const credential = ctx.dbQuery ?
        await credentials.query(query) :
        await credentials.getAll();

      ctx.body = credential;
    },
    show: async function(ctx, next) {
      await next();

      if (!ctx.params.credential) {
        ctx.throw(ResultCodes.BadRequest, 'username required');
      }
      const result = await credentials.get(ctx.params.credential);

      if (!result) {
        ctx.status = ResultCodes.NotFound;
        ctx.body = 'Not Found';
      } else {
        ctx.body = result;
      }
    },
    create: async function(ctx, next) {
      await next();
      if (!ctx.request.body || !ctx.request.body.username ||
        !ctx.request.body.password || !ctx.request.body.userId) {
        ctx.throw(ResultCodes.BadRequest,
            '.username, .password, .userId required');
      }

      const credential = (({username, password, userId}) =>
        ({username, password, userId}))(ctx.request.body);

      await entity.hashPassword(credential)
          .then(credentials.create)
          .then( (credential) => {
            ctx.status = ResultCodes.Created;
            ctx.body = JSON.stringify(credential);
          }, (err) => {
            ctx.status = ResultCodes.Error;
            ctx.body = 'Failed to create credentials';
          });
    },
    update: async function(ctx, next) {
      await next();
      if (!ctx.params.credential) {
        ctx.throw(ResultCodes.BadRequest, 'username required');
      }
      if (!ctx.request.body || !ctx.request.body.password) {
        ctx.throw(ResultCodes.BadRequest, '.password required');
      }

      const credential = (({password}) =>
        ({username: ctx.params.credential, password}))(ctx.request.body);

      await entity.hashPassword(credential)
          .then(credentials.update)
          .then( (credential) => {
            ctx.status = ResultCodes.Created;
            ctx.body = JSON.stringify(credential);
          }, (err) => {
            ctx.status = ResultCodes.Error;
            ctx.body = 'Failed to update credentials';
          });
    },
    destroy: async function(ctx, next) {
      await next();
      if (!ctx.params.credential) {
        ctx.throw(ResultCodes.BadRequest, 'username required');
      }
      await credentials.delete(ctx.params.credential)
          .then(
              () => {
                ctx.status = ResultCodes.Success;
                ctx.body = 'Deleted';
              }, (err) => {
                ctx.status = ResultCodes.Error;
                ctx.body = 'Failed to delete credentials';
              }
          );
    },
  };
};

module.exports.permissions = {
  default: ['user'],
  index: ['admin'],
  show: ['admin'],
  create: ['admin'],
  update: ['admin'],
  destroy: ['admin'],
};
