# promise

# 阻塞问题

在5s内点击按钮test

```html
<html>
    <body>
        <button id="test">test</button>
        <script type="text/javascript">
            function wait(time) {
                const start = Date.now();
                while (Date.now() - start < time) { 
                }
            }
            
            document.getElementById('test').addEventListener('click', () => {
                console.log('click');
            });
            
            setTimeout(() => {
                console.log('setTimeout');
            }, 0);
            
            wait(5000); // 阻塞页面 5s
        </script>
    </body>
</html>
```

解析：

- 立刻执行wait 【阻塞5s】

- 执行"宏任务事件" click

- 任务队列空闲，执行 setTimeout 系列 【与实现有关，可以简单理解为setTimeout系列优先级低于交互事件】

# 2. 基础问题

## demo1

```javascript
const promise1 = new Promise((resolve, reject) => {
  console.log('promise1')
})
console.log('1', promise1);
```

解析：

1. 构造函数，立刻执行

2. 没有使用resolve/reject，状态依然是 `pending`

## demo2

```javascript
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

解析：

1. 构造函数先执行

2. 构造函数外继续执行

3. 微任务执行

## demo3

```javascript
const promise = new Promise((resolve, reject) => {
  console.log(1);
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);

```

解析：

- 构造函数限制性

- 构造外继续执行

- 没有resolve，微任务不执行

## demo4

```javascript
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

解析：

1. 构造函数先执行
  1. 修改promise1的状态

2. 函数外执行
  1. promise1： resolved
  
  2. promise2： pending

3. 执行微任务

## demo5

```javascript
const fn = () => (new Promise((resolve, reject) => {
  console.log(1);
  resolve('success')
}))
fn().then(res => {
  console.log(res)
})
console.log('start')

```

解析：

1. 构造函数线执行

2. 函数外执行

3. 微任务执行

## demo6

```javascript
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

解析：

1. 函数外限制性

2. 执行构造函数

3. 执行微任务

# setTimout与微任务

## demo1

```javascript
console.log('start')
setTimeout(() => {
  console.log('time')
})
Promise.resolve().then(() => {
  console.log('resolve')
})
console.log('end')

```

解析： 微任务与setTimeout基础版

1. 执行最外侧函数

2. 微任务执行

3. setTimeout

## demo2

```javascript
const promise = new Promise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    console.log("timerStart");
    resolve("success");
    console.log("timerEnd");
  }, 0);
  console.log(2);
});
promise.then((res) => {
  console.log(res);
});
console.log(4);
 
```

解析：

1. 构造函数

2. 函数外

3. setTimeout

4. 微任务

## demo3

```javascript
setTimeout(() => {
  console.log('timer1');
  Promise.resolve().then(() => {
    console.log('promise')
  })
}, 0)
setTimeout(() => {
  console.log('timer2')
}, 0)
console.log('start')

```

解析：

1. 函数外

2. 宏任务1
  1. 微任务

3. 宏任务2

## demo4

```javascript
Promise.resolve().then(() => {
  console.log('promise1');
  const timer2 = setTimeout(() => {
    console.log('timer2')
  }, 0)
});
const timer1 = setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(() => {
    console.log('promise2')
  })
}, 0)
console.log('start');

```

解析：

1. 函数外

2. 微任务

3. 宏任务1
  1. 微任务

4. 宏任务2

## demo5

```javascript
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})
const promise2 = promise1.then(() => {
  throw new Error('error!!!')
})
console.log('promise1', promise1)
console.log('promise2', promise2)
setTimeout(() => {
  console.log('promise1', promise1)
  console.log('promise2', promise2)
}, 2000)

```

解析：

1. promise1：pending

2. promise2：pending

3. promise1：resolved

4. promise2：rejected

# 4. then/catch

## demo1

```javascript
const promise = new Promise((resolve, reject) => {
  resolve("success1");
  reject("error");
  resolve("success2");
});
promise
.then(res => {
    console.log("then: ", res);
  }).catch(err => {
    console.log("catch: ", err);
  })

```

解析：

1. 构造函数
  1. 第一个成功

2. 微任务

## demo2

```javascript
const promise = new Promise((resolve, reject) => {
  reject("error");
  resolve("success2");
});
promise
.then(res => {
    console.log("then1: ", res);
  }).then(res => {
    console.log("then2: ", res);
  }).catch(err => {
    console.log("catch: ", err);
  }).then(res => {
    console.log("then3: ", res);
  })

```

解析：

1. 构造函数
  1. 失败

2. Catch

3. then

## demo3

```javascript
Promise.resolve(1)
  .then(res => {
    console.log(res);
    return 2;
  })
  .catch(err => {
    return 3;
  })
  .then(res => {
    console.log(res);
  });

```

解析：

1. 微任务
  1. 成功

2. 成功

## demo4

```javascript
Promise.reject(1)
  .then(res => {
    console.log(res);
    return 2;
  })
  .catch(err => {
    console.log(err);
    return 3
  })
  .then(res => {
    console.log(res);
  });

```

解析：

1. 微任务
  1. 失败【reject-catch】

2. 失败 【catch-then】

## demo5

```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('timer')
    resolve('success')
  }, 1000)
})
const start = Date.now();
promise.then(res => {
  console.log(res, Date.now() - start)
})
promise.then(res => {
  console.log(res, Date.now() - start)
})

```

解析：

1. 定时器

2. 微任务1:success

3. 微任务2:success

注：promise.then 会返回新的promise，这里特殊点是同一个promise，获取到的永远是success

- 对应技巧

```javascript
const data = Promise.resolve([])

// 多次执行
data.then((data)=>{
    console.log(data) // 每次获取都是[]
})
```

## demo6

```javascript
Promise.resolve().then(() => {
  return new Error('error!!!')
}).then(res => {
  console.log("then: ", res)
}).catch(err => {
  console.log("catch: ", err)
})

```

解析：

错误 和 reject/throw 的区别

## demo7

```javascript
const promise = Promise.resolve().then(() => {
  return promise;
})
promise.catch(console.err)

```

解析：

报错，无法返回自身 【死循环】

## demo8

```javascript
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)

```

解析： 值透传

## demo9

```javascript
Promise.reject('err!!!')
  .then((res) => {
    console.log('success', res)
  }, (err) => {
    console.log('error', err)
  }).catch(err => {
    console.log('catch', err)
  })

```

解析： 优先级顺序

- 上一次错误，优先被err捕获

## demo10

```javascript
Promise.resolve(1)
  .then(res => {
    console.log(res);
    return 2;
  })
  .then(res => {
    console.log(res);
    return 3
  })
  .then(res => {
    console.log(res);
  });

  Promise.resolve(11)
  .then(res => {
    console.log(res);
    return 22;
  })
  .then(res => {
    console.log(res);
    return 33
  })
  .then(res => {
    console.log(res);
  });

```

解析：

微任务动态创建

## demo11

```javascript
Promise.resolve('1')
  .then(res => {
    console.log(res)
  })
  .finally(() => {
    console.log('finally')
  })
Promise.resolve('2')
  .finally(() => {
    console.log('finally2')
          return '我是finally2返回的值'
  })
  .then(res => {
    console.log('finally2后面的then函数', res)
  })

```

解析：同上

# async/await

## demo1

```javascript
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}
async1();
console.log('start')

```

解析：

1. "构造"函数

2. "构造"函数2
  1. 休眠/唤醒

3. 函数外

4. 微任务

## demo2

```javascript
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  setTimeout(() => {
    console.log('timer')
  }, 0)
  console.log("async2");
}
async1();
console.log("start")

```

解析：

1. "构造"函数

2. "构造"函数2
  1. 添加宏任务

3. 函数外

4. 微任务

5. 宏任务

## demo3

```javascript
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
  setTimeout(() => {
    console.log('timer1')
  }, 0)
}
async function async2() {
  setTimeout(() => {
    console.log('timer2')
  }, 0)
  console.log("async2");
}
async1();
setTimeout(() => {
  console.log('timer3')
}, 0)
console.log("start")

```

解析：

1. "构造"函数 -- async1 start

2. "构造"函数 -- async2
  1. 添加宏任务 -- 2

3. 函数外 -- start
  1. 添加宏任务 -- 3 

4. 微任务执行 -- async1 end
  1. 添加宏任务 -- 1

5. 宏任务执行 
  1. 2
  
  2. 3
  
  3. 1

## demo4

```javascript
async function fn () {
  return 123
}
fn().then(res => console.log(res))

```

解析：

与下面的描述相同

```javascript
async function fn () {
  return await 123
}
```

## demo5

```javascript
async function async1 () {
  console.log('async1 start');
  await new Promise(resolve => {
    console.log('promise1')
  })
  console.log('async1 success');
  return 'async1 end'
}
console.log('srcipt start')
async1().then(res => console.log(res))
console.log('srcipt end')

```

解析：

1. 外侧函数 - srcipt start

2. "构造"函数 - async1 start

3. "构造"函数2 - promise1

4. 外侧函数 - srcipt end

## demo6

```javascript
async function async1 () {
  console.log('async1 start');
  await new Promise(resolve => {
    console.log('promise1')
    resolve('promise1 resolve')
  }).then(res => console.log(res))
  console.log('async1 success');
  return 'async1 end'
}
console.log('srcipt start')
async1().then(res => console.log(res))
console.log('srcipt end')

```

解析：

1. 外侧函数 - srcipt start

2. "构造"函数 - async1 start

3. "构造"函数2 - promise1
  1. 添加微任务

4. 外侧函数 - srcipt end

5. 微任务执行 - promise1 resolve

6. 微任务执行 - async1 success

7. 微任务执行 - async1 end

## demo7

```javascript
async function async1 () {
  console.log('async1 start');
  await new Promise(resolve => {
    console.log('promise1')
    resolve('promise resolve')
  })
  console.log('async1 success');
  return 'async1 end'
}
console.log('srcipt start')
async1().then(res => {
  console.log(res)
})
new Promise(resolve => {
  console.log('promise2')
  setTimeout(() => {
    console.log('timer')
  })
})

```

解析：

1. 外侧函数 - srcipt start

2. 构造函数 - async1 start

3. 构造函数2 - promise1
  1. 休眠

4. 构造函数3 - promise2
  1. 宏任务

5. 微任务 - async1 success

6. 微任务 - async1 end

7. 宏任务 - timer

## demo8

```javascript
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}

async function async2() {
  console.log("async2");
}

console.log("script start");

setTimeout(function() {
  console.log("setTimeout");
}, 0);

async1();

new Promise(function(resolve) {
  console.log("promise1");
  resolve();
}).then(function() {
  console.log("promise2");
});
console.log('script end')

```

解析：

1. 外侧函数 - script start

2. 宏任务

3. 构造函数 - async1 start

4. 构造函数2 - async2
  1. 休眠

5. 构造函数3- promise1
  1. 休眠

6. 外侧函数 - script end

7. 微任务
  1. async1 end
  
  2. promise2

8. 宏任务 setTimeout

## demo9

```javascript
async function testSometing() {
  console.log("执行testSometing");
  return "testSometing";
}

async function testAsync() {
  console.log("执行testAsync");
  return Promise.resolve("hello async");
}

async function test() {
  console.log("test start...");
  const v1 = await testSometing();
  console.log(v1);
  const v2 = await testAsync();
  console.log(v2);
  console.log(v1, v2);
}

test();

var promise = new Promise(resolve => {
  console.log("promise start...");
  resolve("promise");
});
promise.then(val => console.log(val));

console.log("test end...");

```

**解析**：

```shell
test start...            // 顺序执行
执行testSometing          // 初始化操作为同步
promise start...          // 遇见await 退出【微任务队列】，继续执行初始化
test end...               // 初始化执行完退出，【第二个微任务】顺序执行
testSometing              // 第一个微任务队列
执行testAsync             // 初始化异步操作 【第三个微任务】
promise                   // 第二个微任务
hello async               // 第三个微任务
testSometing hello async  // 闭包数据
```

# 使用Promise实现每隔1秒输出1,2,3

```javascript
const arr = [1, 2, 3]
arr.reduce((p, x) => {
  return p.then(() => {
    return new Promise(r => {
      setTimeout(() => r(console.log(x)), 1000)
    })
  })
}, Promise.resolve())

```

# 7. 使用Promise实现红绿灯交替重复亮

题目：

```javascript
function red() {
    console.log('red');
}
function green() {
    console.log('green');
}
function yellow() {
    console.log('yellow');
}

```

```javascript
function red() {
  console.log("red");
}
function green() {
  console.log("green");
}
function yellow() {
  console.log("yellow");
}
const light = function (timer, cb) {
  return new Promise(resolve => {
    setTimeout(() => {
      cb()
      resolve()
    }, timer)
  })
}
const step = function () {
  Promise.resolve().then(() => {
    return light(3000, red)
  }).then(() => {
    return light(2000, green)
  }).then(() => {
    return light(1000, yellow)
  }).then(() => {
    return step()
  })
}

step();

```

# 8. 封装一个异步加载图片的方法

```javascript
function loadImg(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function() {
      console.log("一张图片加载完成");
      resolve(img);
    };
    img.onerror = function() {
            reject(new Error('Could not load image at' + url));
    };
    img.src = url;
  });

```
