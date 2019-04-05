const convert = require('koa-convert');
const Resource = require('koa-resource-router');

const checkPermission = (ctx, permissionSet) => {
    if (!permissionSet || permissionSet.length == 0) {
        return true;
    }

    if (!ctx.isAuthenticated()) {
        return false;
    }

    if (ctx.req.user.roles.includes("super")) {
        return true;
    }

    return  permissionSet.some( (perm) => typeof perm === "function" ?
                perm(ctx.req.user, ctx.request.body, ctx.params) :
                perm === "user" || (ctx.req.user.roles && ctx.req.user.roles.includes(perm)));
}



const wrapExport = (exp, permissions, entryPoint) =>
    function*(next) {
        if (permissions) {
            if (!checkPermission(this, permissions.default) || !checkPermission(this, permissions[entryPoint])) {
                this.throw(403, "Not Authorized");
            }
        }

        yield convert.back(exp[entryPoint]);
    }

module.exports = (basePath) => (...middleware) => (entity) => {

    const resourceModule = require(`${basePath}/resources/${entity}.js`);
    const importedResorce = resourceModule(require(`${basePath}/entity/${entity}.js`));

    const builtResource = {};
    for(let entryPoint in importedResorce) {
        builtResource[entryPoint] = wrapExport(importedResorce, resourceModule.permissions, entryPoint);
    }

    return new Resource(entity, ...middleware, builtResource);
}
