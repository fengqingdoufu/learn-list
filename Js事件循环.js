
// Javascript 有一个main thread 主线程和 call-stack 调用栈(执行栈)，所有的任务都会被放到调用栈等待主线程执行。

// Javascript单线程任务被分为同步任务和异步任务，
// 同步任务会在调用栈中按照顺序等待主线程依次执行，
// 异步任务会在异步任务有了结果后，将注册的回调函数放入任务队列中等待主线程空闲的时候（调用栈被清空），被读取到栈内等待主线程的执行。

// 执行栈在执行完同步任务后，查看执行栈是否为空，如果执行栈为空，
// 就会去检查微任务(microTask)队列是否为空，如果为空的话，就执行Task（宏任务），否则就一次性执行完所有微任务

// async函数返回一个 Promise对象，可以使用then方法添加回调函数。当函数执行的时候，
// 一旦遇到await就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。
// iterator Generator yield

// console.log('script start');
//
// setTimeout(function() {
//     console.log('setTimeout');
// }, 0);
//
// Promise.resolve().then(function() {
//     console.log('promise1');
// }).then(function() {
//     setTimeout(function() {
//         console.log('promise2');
//     }, 0);
//     console.log('promise2');
// });
// console.log('script end');
//
// console.log('script start')
// return false

//  =============================
async function async1() {
    await async2() // 由于async函数使用await后得语句会被放入一个回调函数中，所以把下面的放入微任务Event Queue中。
    console.log('7.（async2的微任务执行返回后，遇到await，再次加入微任务3）async1 end')
}
async function async2() {
   await new Promise(resolve => {
        console.log('1.所有的开始');  // 序号1
        setTimeout(() => {
            // resolve(); 如果resolve在定时器里，运行到这里，只有一个宏任务，并没有产生微任务，微任务的产生要再promise的状态确定后
            console.log('async2 start'); // 遇到定时器(等待定时时间过去后)，加入宏任务中
        },0)
       resolve(); // 此时产生一个微任务，并且遇到await
    });
   console.log('4.(await的回调调用，微任务1，暂时不返回，所以async1中的await还未执行到)async2 end') // 由于async函数使用await后得语句会被放入一个回调函数中，所以把下面的放入微任务Event Queue中。
}
async1()
setTimeout(function() {
    console.log('setTimeout')
}, 0)

new Promise(resolve => {
    console.log('2.Promise') // 序号2
    resolve() // 执行到这里，产生一个微任务
})
    .then(function() {
        console.log('5.（正常的微任务2执行）promise1')
    })
    .then(function() {
        console.log('6.（正常的微任务2执行）promise2')
    })

console.log('3.script end') // 序号3  同步任务序号3 此时第一个代码块宏任务结束，检查微任务队列
// ==============================

// async function async1() {
//     console.log('async1 start 我是第二');
//     await async2();
//     console.log('async1 end 我是第五');
// }
// async function async2() {
//     console.log('async2 我是第三');
// }
// console.log('script start 我是第一');
// async1();
// new Promise(function(resolve) {
//     console.log('promise2 我是第四');
//     resolve();
// }).then(function() {
//     console.log('then3 我是第六');
// });

// 遇到执行async1(), 进入async的执行上下文之后，遇到console.log输出  async1 start
// 然后遇到await async2()，由于()的优先级高，所有立即执行async2()，进入async2()的执行上下文。
// 看到console.log输出async2，之后没有返回值，结束函数，返回undefined，返回async1的执行上下文的await
// undefined，由于async函数使用await后得语句会被放入一个回调函数中，所以把下面的放入微任务Event Queue中。

// 总结
// 1.事件循环机制，分为宏任务，微任务。各自有自己的任务队列
// 2.代码块为宏任务，执行过程中，遇到相应的宏任务，微任务队列任务会放到对应的位置中
// 3.该代码块(宏任务)执行完成，检查微任务队列是否为空，不为空则一次性执行完(例如promise)
// 4.继续下一个宏任务(setTimeout)

// 调用iterator 接口 遍历器()
// Generator(暂停函数) yield表达式 暂停函数运行到yield表达式会暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。
// async await 就是暂停函数的语法糖，只是自带执行器的Generator函数
// async await 与promise的区别。async await就是用promise来实现的
async function fn1(args) {
    // ...
}
// 等同于
function fn2(args) {
    return spawn(function* () {
        // ...
    });
}
// 自动执行器
function spawn(genF) {
    return new Promise(function(resolve, reject) {
        const gen = genF();
        function step(nextF) {
            let next;
            try {
                next = nextF();
            } catch(e) {
                return reject(e);
            }
            if(next.done) {
                return resolve(next.value);
            }
            Promise.resolve(next.value).then(function(v) {
                step(function() { return gen.next(v); });
            }, function(e) {
                step(function() { return gen.throw(e); });
            });
        }
        step(function() { return gen.next(undefined); });
    });
}
