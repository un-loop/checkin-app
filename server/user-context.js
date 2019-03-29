const defaultConfig = {
    httpOnly: false,
    signed: false
};

module.exports = (config) => {
    if (!config) config = defaultConfig;

    return async (ctx, next) => {
        await next();

        let payload = {
            username: ctx.req.user ? ctx.req.user.username : "",
            name: ctx.req.user ?  ctx.req.user.name : "",
            isAdmin: ctx.req.user ? ctx.req.user.roles.findIndex((item) => item === "super" ) !== -1 : false,
            isLoggedIn: Boolean(ctx.req.user)
        }

        ctx.cookies.set("user-context",JSON.stringify(payload), config);

    }
}
