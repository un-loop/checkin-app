module.exports = function(middleware) {
    return function*(next) {
        yield middleware(this, () => Promise.resolve());
        yield next;
    }
}
