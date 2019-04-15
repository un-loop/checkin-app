const defaultConfig = {
    httpOnly: false,
    signed: false
};

module.exports = (payloadCallback, config) => {
    if (!config) config = defaultConfig;

    return async (ctx, next) => {
        await next();

        let payload = payloadCallback(ctx.req.user);
        ctx.cookies.set("user-context",JSON.stringify(payload), config);
    }
}
