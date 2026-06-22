# v\-debounce：防抖

# 实现

click版

```JavaScript
const debounce = {
    inserted: (el, binding) => {
        // 没有绑定函数抛出错误
        if (typeof binding.value !== 'function') {
            throw 'debounce callback not a function'
        }

        let timer
        el.addEventListener('click', () => {
            if (timer) clearTimeout(timer)

            timer = setTimeout(_ => {
                binding.value()
            }, 1000)
        })
    }
}
```

