// Function.prototype.addMethods = function (name, fn) {
//     // this.prototype[name] = fn
//     this[name] = fn
//     return this
// }
// let Methods = function () {}
// Methods.addMethods('add', function () {
//     console.log('add')
//     return this
// }).addMethods('reduce', function () {
//     console.log('reduce')
//     return this
// })
//
// Methods.add().reduce()

Function.prototype.addMethods = function (name, fn) {
    console.log(this)
    this.prototype[name] = fn
    return this
}
let Methods = new Function()
// console.log(Function.prototype)
// console.log(Methods.addMethods)
Methods.addMethods('add', function () {
    console.log('add')
    // console.log(this)
    return this
}).addMethods('reduce', function () {
    console.log('reduce')
    return this
})
let m = new Methods()
m.add().reduce()


// Function 的原型上添加了方法返回的this指向尚未确定
// new一个Function此方法相当于被新的对象继承，当调用此方法时，this的指向为当前对象

// 调用了原型上的方法时 会给当前new出来的对象添加原型方法，并且这个方法返回的this指向也尚未确定
// 当再new一次当前对象时，新的对象调用了原型方法，this的指向变成新的对象
