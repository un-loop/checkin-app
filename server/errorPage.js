const path = require("path");
const fs = require("fs").promises;

const pages = {
    401: path.resolve(__dirname, "../error/401.html"),
    403: path.resolve(__dirname, "../error/403.html"),
    404: path.resolve(__dirname, "../error/404.html"),
    500: path.resolve(__dirname, "../error/500.html"),
    generic: path.resolve(__dirname, "../error/generic.html")
}

module.exports = async (ctx, next) => {
    await next();
    const status = ctx.status;

    const content = ctx.status && pages[ctx.status] ?
        await fs.readFile(pages[ctx.status]) :
        await fs.readFile(pages["generic"]);
    ctx.body = content;
    ctx.status = status;
    ctx.type = "text/html";
}
