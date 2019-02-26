module.exports = function(resource) {
    return function* (next) {
        let resources = [];
        resources.push(resource);

        // beware that nested.middleware() can be an async function, which will cause resources.push()
        // to be executed in a continuation, so we need to be sure to have nested be a block scoped
        // variable
        for(let nested = resources.pop(); nested; nested = resources.pop()) {
            yield nested.middleware().call(this, next);
            resources.push(...nested.resources);
        }

        return yield next;
    }
}
