# 【15m】v\-Clipboard：粘贴板

**视频**：

https://g15x4fm9ei6\.feishu\.cn/minutes/obcn5dm13t54ic37s5t89186

粘贴板是富文本下面的内容，粘贴的内容不一定是字符串

**练习**

https://code\.juejin\.cn/pen/7535764531587645449

```XML
<template>
  <button  @click="isShow = !isShow">点击</button>  
  <div v-if="isShow">
    <div v-copy>click me {{count}}</div>
  </div>
</template>

<script setup>
import { defineComponent, ref } from 'vue';
const count = ref(0);
const isShow = ref(true)
const map = new WeakMap()

const vCopy = {
      mounted(el,binging){
        const cb = async function(){
          try{
            const raw = el.innerText
            const flag = await navigator.clipboard.writeText(raw)
            console.log(flag,'flag')
          }catch(e){
            console.log('error',e)
          }
        }
        map.set(el,cb)
        el.addEventListener("click",cb)
      },
      unmounted(el){
        const cb = map.get(el)
        el.removeEventListener("click",cb)
        console.log("卸载")
      }
}
</script>

<style>
.count {
  color: red;
}
</style>
      
```

# document\.execCommand

https://developer\.mozilla\.org/zh\-CN/docs/Web/API/Document/execCommand

```JavaScript
function copy(value){
    // 1. 创建 textArea
    const textarea = document.createElement("textarea")
    textarea.innerText = value
    document.body.appendChild(textarea)
    // 2. 选中
    textarea.select()
    // 3. 指令copy脚本
    const result = document.execCommand('copy')
    document.body.removeChild(textarea)
}
```

1. 一个文档只有一个选中，选中状态会丢失【不重要】

2. 只能在用户交互事件中使用：出于安全考虑，该方法只能在用户触发的事件（如 `click`、`keydown` 等）中调用，否则会失效。【版本兼容性】

3. 兼容性：虽然主流浏览器都支持，但它属于过时（deprecated）的 API，未来可能会被移除。

4. 只能复制文本

5. 本质是`copy`事件，对应的是 `如何禁止/修改用户复制`

```JavaScript
document.addEventListener('copy', e => {
    e.preventDefault()
})
```

# navigator\.clipboard \- 粘贴板

https://developer\.mozilla\.org/zh\-CN/docs/Web/API/Clipboard



- `navigator.clipboard.writeText`：用于将文本内容写入剪贴板

- `navigator.clipboard.write`：用于将任意数据写入剪贴板，可以是文本数据，也可以是**二进制数据**。

- `navigator.clipboard.readText` ：用于复制剪贴板里面的文本数据

- `navigator.clipboard.read` ： 用于复制剪贴板里面的数据，可以是文本数据，也可以是二进制数据（比如图片）



## **权限**

- 必须是https/localhost的

- 必须用户执行的

    - document\.hasFocus\(\)

## 页面激活

`document.hasFocus()`,用于判断当前页面是否激活 



# 花活

- 双击复制

- 富文本\-带有格式的文本

- 禁止粘贴

- 点击截图【 chart图，table 表格】

- 长截图服务

# 开源库参考

[https://github\.com/euvl/v\-clipboard](https://github.com/euvl/v-clipboard) 



```TypeScript
import { Convert } from './convert'
import { Textarea } from './textarea'

export const Clipboard = {
  /**
   * Requests Navigator API persmission to clipboard.
   */
  async requestClipboardPermission() {
    return navigator.permissions.query({
      name: 'clipboard-write' as PermissionName
    })
  },
  /**
   * Writes to cliboard using Navigator API.
   */
  async writeClipboard(value: string) {
    const permissions = await Clipboard.requestClipboardPermission()

    if (permissions.state === 'granted') {
      await navigator.clipboard.writeText(value)
      return true
    }

    return false
  },
  /**
   * Writes to clipboard using old-school execCommand('copy').
   */
  writeClipboardExecCommand(value: string) {
    const textarea = Textarea.createTextarea(value)

    document.body.appendChild(textarea)

    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      textarea.contentEditable = 'true'
      textarea.readOnly = true

      const range = document.createRange()

      range.selectNodeContents(textarea)

      const selection = window.getSelection()

      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
        textarea.setSelectionRange(0, 999999)
      }
    } else {
      textarea.select()
    }

    const result = document.execCommand('copy')
    document.body.removeChild(textarea)

    return result
  },
  /**
   * Maes an attempt to copy data to the clipboard.
   */
  async copy(input: any) {
    const data = typeof input === 'function' ? input() : input
    const value = Convert.asString(data)

    const copied = Clipboard.writeClipboardExecCommand(value)

    if (copied) {
      return true
    }

    await Clipboard.writeClipboard(value)
  }
}
```

