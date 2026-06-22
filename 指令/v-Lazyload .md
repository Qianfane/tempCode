# v\-Lazyload 

**目标**：

统一处理图片的loading状态，包括

- 包含惰性下载

- 图片正在请求时，使用loading/骨架屏

- 图片加载失败，统一处理异常

- 包含重试处理【略】

- 统一添加w/h，防止重绘与重排【略，涉及webpack/vite插件】

- \.\.\.



# 图片下载

处理图片的**生命周期**，此处逻辑与xhr请求完全一致，无非是state在处理时，需要如何处理

假设我们封装imgComponent，大概如下结构

loading：对应loadingSrc

error：对应loadingSrc

```HTML
<template>
    <div v-if="status === 1">loading</div>
     <div v-if="status === 3">error</div>
    <img v-if="status === 2" :src="src">
</template>
<script setup>
    // 异步下载图片
    function loadAsyncImg(src){
        return new Promise((resolve,reject)=>{
            const img = new Image()
            // 图片下载成功
            img.onload = () => {
              resolve()
            }
            // 加载失败
            img.onerror = () => {
              reject()
            }
            // 开始加载
            img.src = image.src
        })
    }
    
    // 处理图片地址
    async function loadImg(src){
        this.status = 1   // loading 
        try{
            await loadAsyncImg(src)
            this.status = 2 // 成功
        }catch(e){
            this.status = 3 // 失败
        }
    }
</script>
```

# 骨架屏

另一种形式是loading，此处可以先创建一个`vSkeleton`预热

```HTML

```





# 惰性加载

使用`IntersectionObserver`在快接近目标是，触发`loadImg`

```JavaScript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadImg(entry.target)
        observer.unobserve()
      }
    })
  }, {
    rootMargin: "100% 0px"
  })
```

# 练习

```HTML

```

# VueLazyload 

https://github\.com/hilongjw/vue\-lazyload

