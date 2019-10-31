function test(a,b) {
    console.log(a)
    console.log(c)
    var c = 123
    function a() {}
    console.log(b)
    function c() {}
    var b = function cd() {}
    console.log(b)
}
test(1,3)
function f(a) {
  console.log(a)
  function a() {}
}
f(1)
// GO
/*
 1.GO {} 初始化
 2.GO {
       this: undefined
       test: undefined
 }
 3.GO {
      this: window
      test: function test(){}
 }
 */
// AO 初始化AO 初始化后再考虑执行后的赋值
/*
 1.AO {}
 2.AO {
    arguments: undefined
    a:undefined
    b:undefined
    c:undefined
 }
 3.AO {
    arguments：[]
    a: 1,
    b: 3,
    c: undefined
 }
 4.AO {
    a: function a(){},
    b: 3,
    c: function c(){},
  }
 */

