const ResultCodes =require("../resultCodes");

module.exports = (entity) => {
    const profiles = entity.table;

    return {
        index: async function(ctx, next) {
            await next();

            const profiles = ctx.dbQuery ?
                await profiles.query(ctx.dbQuery.isOrdered ? ctx.dbQuery : ctx.dbQuery.order(true)) :
                await profiles.getAll();

            ctx.body = profiles;
        },
        show: async function(ctx, next) {
            await next();

            if (!ctx.params.user) ctx.throw(ResultCodes.BadRequest, 'userId required');
            var result = await profiles.get(ctx.params.user);

            if (!result) {
                ctx.status = ResultCodes.NotFound;
                ctx.body = 'Not Found';
            } else {
                ctx.body = result;
            }
        },
        create: async function(ctx, next) {
            await next();

            if (!ctx.params.user) ctx.throw(ResultCodes.BadRequest, 'userId required');

            if (!ctx.request.body || !ctx.request.body.name) ctx.throw(ResultCodes.BadRequest, '.name required');
            let profile = (({name }) => ({ userId: ctx.params.user, name }))(ctx.request.body);

            await profiles.create(profile)
                .then( (profile) => {
                    ctx.status = ResultCodes.Created;
                    ctx.body = JSON.stringify(profile);
                }, (err) => {
                    ctx.status = ResultCodes.Error;
                    ctx.body = "Failed to create profile";
                });
        },
        update: async function(ctx, next) {
            await next();

            if (!ctx.params.user) ctx.throw(ResultCodes.BadRequest, 'userId required');

            let profile = (({ name }) => ({ userId: ctx.params.user, name }))(ctx.request.body);

            await profiles.update(profile)
                .then( (profile) => {
                    ctx.status = ResultCodes.Created;
                    ctx.body = JSON.stringify(profile);
                }, (err) => {
                    ctx.status = ResultCodes.Error;
                    ctx.body = "Failed to update profile";
                });
        },
        destroy: async function(next) {
            await next();
            if (!ctx.params.user) ctx.throw(ResultCodes.BadRequest, 'userId required');

            await profiles.delete(ctx.params.user)
            .then(
                () => {
                    ctx.status = ResultCodes.Success;
                    ctx.body = "Deleted";
                }, (err) => {
                    ctx.status = ResultCodes.Error;
                    ctx.body = "Failed to delete profile";
                }
            )
        }
    }
};

module.exports.permissions = {
    default: ["user"],
    index: ["admin"],
    show: ["admin"],
    create: ["admin"],
    update: ["admin", (user, body, params) => user.userId === params.userId],
    destroy: ["admin"]
}
