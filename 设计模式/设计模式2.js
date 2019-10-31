function Class1() {
    this.name = 'Tofu';
    this.prototype = {}
}

Class1.prototype.addMehtods = function (name, fn) {
    // console.log(this.name)
    console.log(fn)
    console.log(this)
    console.log(this.prototype)
    this.prototype[name] = fn
};
let method1 = new Class1();
method1.addMehtods('reduce', function () {});


