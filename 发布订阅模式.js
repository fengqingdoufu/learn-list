class Foo {
    // 无效方式  static obj = {};
    constructor() {
        // 无效方式 Foo.obj = {}
    }

    on(key, value) {
        if (!Foo.obj) {
            Foo.obj = {}
        }
        if (!Foo.obj[key]) {
            Foo.obj[key] = []
        }
        Foo.obj[key].push(value)
    }
    emit() {
       const key  = Array.prototype.shift.apply(arguments)
       let fns =  Foo.obj[key];
       if (!fns || fns.length === 0) {
           return false
       }
       for (let fn of fns) {
           fn.apply(null, arguments)
       }
       return true
    }
    off(key, fn) {
        let fns = Foo.obj(key)
        if (!fns || fns.length === 0 || !fn) {
            return false
        }
        for (let l = fns.length - 1; l >= 0; l--) {
              let _fn = fns[l];
              if (_fn === fn) {
                  fns.splice(l, 1);
              }
        }
        return true
    }
}
// 有效方式
Foo.obj  = {
}

// TODO 简易版发布-订阅模式
let handle = {
    a: 1,
    init() {
        let  foo1 = new Foo()
        foo1.on('event', (key) => {
            console.log(key, this)
        })
    }
}
handle.init()
let handle2 = {
    init() {
        let  foo1 = new Foo()
        foo1.emit('event', 1)
    }
}
handle2.init()
