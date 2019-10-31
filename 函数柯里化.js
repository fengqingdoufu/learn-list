// 柯里化
let _arg = []
Array.prototype.push.apply(_arg, [].slice.call([1, 3, 4]))
console.log(_arg)

let currying = function (fn) {
    let _args = [];
    return function cb() {
        if (arguments.length === 0) {
            console.log(this)
            return fn.apply(this, _args)
        }
        Array.prototype.push.apply(_args, [].slice.call(arguments));
        return cb
    }
};
let score = 0;
let addScore = currying(function () {
    for (let i = 0; i < arguments.length; i++) {
        score += arguments[i]
    }
});

addScore(2, 2)();
