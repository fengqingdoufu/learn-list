// 流式编程
~(function (win) {
    var stream =  function (array) {
        if (!(this instanceof stream)) {
            return new stream(array)
        }
        this.wrap = array;
    };
    stream.unique = function(array, cb) {
        let  result = [];
        for (let i = 0; i < array.length; i++) {
            let target = cb ? cb(array[i]) : array[i];
            if (result.indexOf(target) === -1) {
                result.push(target)
            }
        }
        return result;
    };
    stream.map1 = function(array) {
        array.push('max');
        return array;
    };
    // 开启链接式的调用
    stream.chain = function(obj) {
        var instance = stream(obj);
        instance._chain = true;
        return instance
    };
    stream.result = function(instance, obj) {
        if (instance._chain) {
            instance.wrap = obj;
            return instance
        }
        return obj;
    };
    stream.prototype.values = function() {
        return this.wrap()
    };
    stream.functions = function(obj) {
        var result = [];
        for (let key in obj ) {
            if (obj.hasOwnProperty(key)) {
                result.push(key)
            }
        }
        return result;
    };
    stream.each = function(array, cb) {
        for (let i = 0; i < array.length; i++) {
            cb.call(array, array[i], i)
        }
    };
    stream.mixin = function(obj) {
        stream.each(stream.functions(obj), function (name) {
            let func = stream[name];
            stream.prototype[name] = function () {
                let arg = [this.wrap];
                [].push.apply(arg, [].slice.call(arguments));
                return stream.result(this, func.apply(this, arg))
            }
        })
    };
    stream.mixin(stream);
    win.stream = stream;
})(window);

console.log(stream.unique([1,2,2,3,'A', 'a'],function (key) {
    return typeof key === 'string' ? key.toLowerCase() : key
}).map1());
console.log(stream([1,2,2,3,'A', 'a']).chain().unique(function (key) {
    return typeof key === 'string' ? key.toLowerCase() : key
}).map1());
