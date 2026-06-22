# v\-throttle：节流

```Bash
const throttle = {
    bind: (el, binding) => {
        // 没有绑定函数抛出错误
        if (typeof binding.value !== 'function') {
            throw 'throttle callback not a function'
        }

        // 开关
        el._flag = true
        el._timer = null
        el._handler = () => {
            if (!el._flag) return

            // 函数执行后关闭开关
            el._flag && binding.value()
            el._flag = false

            if (el._timer) clearTimeout(el._timer)

            el._timer = setTimeout(_ => {
                el._flag = true
            }, 1000)
        }
        el.addEventListener('click', el._handler)
    },
    unbind: (el, binding) => {
        el.removeEventListener('click', el._handler)
    }
}

export default throttle
```

