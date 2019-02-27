module.exports = () => async (ctx, next) => {
    for(let param in ctx.params) {
        ctx.params[param] = decodeURI(ctx.params[param]);
    }

    await next();
}
