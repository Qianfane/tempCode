完整面试题地址：[https://feinterview.poetries.top](https://feinterview.poetries.top)

作者：程序员poetry

扫码关注作者公众号：「前端进阶之旅」 每天分享技术干货

![前端进阶之旅公众号二维码](https://s.poetries.top/common/20211001080240.png)

**event loop它的执行顺序：**

-   一开始整个脚本作为一个宏任务执行
-   执行过程中同步代码直接执行，宏任务进入宏任务队列，微任务进入微任务队列
-   当前宏任务执行完出队，检查微任务列表，有则依次执行，直到全部执行完
-   执行浏览器UI线程的渲染工作
-   检查是否有Web Worker任务，有则执行
-   执行完本轮的宏任务，回到2，依此循环，直到宏任务和微任务队列都为空

**微任务包括**：`MutationObserver`、`Promise.then()`或`reject()`、`Promise`为基础开发的其它技术，比如`fetch API`、`V8`的垃圾回收过程、`Node`独有的`process.nextTick`。

**宏任务包括**：`script、script` 、`setTimeout`、`setInterval` 、`setImmediate` 、`I/O` 、`UI rendering`

## [#](#_1-promise的几道基础题) 1 Promise的几道基础题

### [#](#_1-1-题目一) 1.1 题目一

```
const promise1 = new Promise((resolve, reject) => {
  console.log('promise1')
})
console.log('1', promise1);
```

@前端进阶之旅: 代码已经复制到剪贴板

-   从上至下，先遇到new Promise，执行该构造函数中的代码promise1
-   然后执行同步代码1，此时promise1没有被resolve或者reject，因此状态还是pending

```
'promise1'
'1' Promise{<pending>}
```

@前端进阶之旅: 代码已经复制到剪贴板

### [#](#_1-2-题目二) 1.2 题目二

```
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve('success')
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);
```

@前端进阶之旅: 代码已经复制到剪贴板

-   从上至下，先遇到new Promise，执行其中的同步代码1
-   再遇到resolve(‘success’)， 将promise的状态改为了resolved并且将值保存下来
-   继续执行同步代码2
-   跳出promise，往下执行，碰到promise.then这个微任务，将其加入微任务队列
-   执行同步代码4
-   本轮宏任务全部执行完毕，检查微任务队列，发现promise.then这个微任务且状态为resolved，执行它。

```
1 2 4 3
```

@前端进阶之旅: 代码已经复制到剪贴板

### [#](#_1-3-题目三) 1.3 题目三

```
const promise = new Promise((resolve, reject) => {
  console.log(1);
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);
```

@前端进阶之旅: 代码已经复制到剪贴板

-   和题目二相似，只不过在`promise`中并没有`resolve`或者`reject`
-   因此`promise.then`并不会执行，它只有在被改变了状态之后才会执行。

```
1 2 4
```

@前端进阶之旅: 代码已经复制到剪贴板

### [#](#_1-4-题目四) 1.4 题目四

```
const promise1 = new Promise((resolve, reject) => {
  console.log('promise1')
  resolve('resolve1')
})
const promise2 = promise1.then(res => {
  console.log(res)
})
console.log('1', promise1);
console.log('2', promise2);
```

@前端进阶之旅: 代码已经复制到剪贴板

-   从上至下，先遇到`new Promise`，执行该构造函数中的代码`promise1`
-   碰到`resolve`函数, 将`promise1`的状态改变为`resolved`, 并将结果保存下来
-   碰到`promise1.then`这个微任务，将它放入微任务队列
-   `promise2`是一个新的状态为`pending的`Promise\`
-   执行同步代码1， 同时打印出`promise1`的状态是`resolved`
-   执行同步代码2，同时打印出`promise2`的状态是`pending`
-   宏任务执行完毕，查找微任务队列，发现`promise1.then`这个微任务且状态为resolved，执行它。

```
'promise1'
'1' Promise{<resolved>: 'resolve1'}
'2' Promise{<pending>}
'resolve1'
```

@前端进阶之旅: 代码已经复制到剪贴板

### [#](#_1-5-题目五) 1.5 题目五

```
const fn = () => (new Promise((resolve, reject) => {
  console.log(1);
  resolve('success')
}))
fn().then(res => {
  console.log(res)
})
console.log('start')
```

@前端进阶之旅: 代码已经复制到剪贴板

请仔细看看哦，fn函数它是直接返回了一个new Promise的，而且fn函数的调用是在start之前，所以它里面的内容应该会先执行。

```
1
'start'
'success'
```

@前端进阶之旅: 代码已经复制到剪贴板

### [#](#_1-6-题目六) 1.6 题目六

如果把fn的调用放到start之后呢？

```
const fn = () =>
  new Promise((resolve, reject) => {
    console.log(1);
    resolve("success");
  });
console.log("start");
fn().then(res => {
  console.log(res);
});
```

@前端进阶之旅: 代码已经复制到剪贴板

现在start就在1之前打印出来了，因为fn函数是之后执行的。

> 注意⚠️：之前我们很容易就以为看到`new Promise()`就执行它的第一个参数函数了，其实这是不对的，就像这两道题中，我们得注意它是不是被包裹在函数当中，如果是的话，只有在函数调用的时候才会执行。

```
"start"
1
"success"
```

@前端进阶之旅: 代码已经复制到剪贴板

## [#](#_2-promise结合settimeout) 2. Promise结合setTimeout

### [#](#_2-1-题目一) 2.1 题目一

```
console.log('start')
setTimeout(() => {
  console.log('time')
})
Promise.resolve().then(() => {
  console.log('resolve')
})
console.log('end')
```

@前端进阶之旅: 代码已经复制到剪贴板

-   刚开始整个脚本作为一个宏任务来执行，对于同步代码直接压入执行栈进行执行，因此先打印出start和end。
-   setTimout作为一个宏任务被放入宏任务队列(下一个)
-   Promise.then作为一个微任务被放入微任务队列
-   本次宏任务执行完，检查微任务，发现Promise.then，执行它
-   接下来进入下一个宏任务，发现setTimeout，执行。

```
'start'
'end'
'resolve'
'time'
```

@前端进阶之旅: 代码已经复制到剪贴板

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

加载中...

← [2 面试综合汇总](/docs/qa/2-面试综合汇总)