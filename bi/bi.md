event loop它的执行顺序：

一开始整个脚本作为一个宏任务执行
执行过程中同步代码直接执行，宏任务进入宏任务队列，微任务进入微任务队列
当前宏任务执行完出队，检查微任务列表，有则依次执行，直到全部执行完
执行浏览器UI线程的渲染工作
检查是否有Web Worker任务，有则执行
执行完本轮的宏任务，回到2，依此循环，直到宏任务和微任务队列都为空
微任务包括：MutationObserver、Promise.then()或reject()、Promise为基础开发的其它技术，比如fetch API、V8的垃圾回收过程、Node独有的process.nextTick。

宏任务包括：script、script 、setTimeout、setInterval 、setImmediate 、I/O 、UI rendering

#1 Promise的几道基础题
#1.1 题目一
const promise1 = new Promise((resolve, reject) => {
console.log('promise1')
})
console.log('1', promise1);
@前端进阶之旅: 代码已经复制到剪贴板
从上至下，先遇到new Promise，执行该构造函数中的代码promise1
然后执行同步代码1，此时promise1没有被resolve或者reject，因此状态还是pending
'promise1'
'1' Promise{<pending>}
@前端进阶之旅: 代码已经复制到剪贴板
#1.2 题目二
const promise = new Promise((resolve, reject) => {
console.log(1);
resolve('success')
console.log(2);
});
promise.then(() => {
console.log(3);
});
console.log(4);
@前端进阶之旅: 代码已经复制到剪贴板
从上至下，先遇到new Promise，执行其中的同步代码1
再遇到resolve(‘success’)， 将promise的状态改为了resolved并且将值保存下来
继续执行同步代码2
跳出promise，往下执行，碰到promise.then这个微任务，将其加入微任务队列
执行同步代码4
本轮宏任务全部执行完毕，检查微任务队列，发现promise.then这个微任务且状态为resolved，执行它。
1 2 4 3
@前端进阶之旅: 代码已经复制到剪贴板
#1.3 题目三
const promise = new Promise((resolve, reject) => {
console.log(1);
console.log(2);
});
promise.then(() => {
console.log(3);
});
console.log(4);
@前端进阶之旅: 代码已经复制到剪贴板
和题目二相似，只不过在promise中并没有resolve或者reject
因此promise.then并不会执行，它只有在被改变了状态之后才会执行。
1 2 4
@前端进阶之旅: 代码已经复制到剪贴板
#1.4 题目四
const promise1 = new Promise((resolve, reject) => {
console.log('promise1')
resolve('resolve1')
})
const promise2 = promise1.then(res => {
console.log(res)
})
console.log('1', promise1);
console.log('2', promise2);
@前端进阶之旅: 代码已经复制到剪贴板
从上至下，先遇到new Promise，执行该构造函数中的代码promise1
碰到resolve函数, 将promise1的状态改变为resolved, 并将结果保存下来
碰到promise1.then这个微任务，将它放入微任务队列
promise2是一个新的状态为pending的Promise`
执行同步代码1， 同时打印出promise1的状态是resolved
执行同步代码2，同时打印出promise2的状态是pending
宏任务执行完毕，查找微任务队列，发现promise1.then这个微任务且状态为resolved，执行它。
'promise1'
'1' Promise{<resolved>: 'resolve1'}
'2' Promise{<pending>}
'resolve1'
@前端进阶之旅: 代码已经复制到剪贴板
#1.5 题目五
const fn = () => (new Promise((resolve, r
