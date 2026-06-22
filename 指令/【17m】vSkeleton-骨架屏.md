# 【17m】vSkeleton\-骨架屏

**视频**：

https://g15x4fm9ei6\.feishu\.cn/minutes/obcn536txm8a987mzm3ne5j7

**骨架屏**：指令版，**动态创建组件**

简单的骨架屏，使用指令进行代替，此处仅用于做动态创建组件的练习，其技巧在其他地方有使用

- 使用render动态创建组件

- 理解vnode与实例的关系

- 通过weakMap与el，传递参数

- 卸载组件

- \.\.\.

注：也可以理解为 **另一种loading**的表现

```HTML
<div v-skeleton="{loading:loading}">
    123
</div>
```

https://element\-plus\.org/zh\-CN/component/skeleton\.html\#skeleton\-attributes

# **实现**

[地址](https://element-plus.run/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZixyZW5kZXIsaCB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7RWxTa2VsZXRvbn0gZnJvbSAnZWxlbWVudC1wbHVzJ1xuXG5jb25zdCBsb2FkaW5nID0gcmVmKHRydWUpXG5cbmNvbnN0IG1hcCA9IG5ldyBXZWFrTWFwKClcblxuY29uc3QgdlNrZWxldG9uID0ge1xuICBtb3VudGVkKGVsLGJpbmdpbmcpe1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikgLy8g5Y+v5Lul5oyC6L295LiN5ZCM55qE5qC35byP6Ziy5q2iY3Nz562J5L+h5oGv55qE5rGh5p+TXG4gICAgZWwuYXBwZW5kQ2hpbGQoY29udGFpbmVyKVxuICAgIGNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIlxuICAgIGNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gXCIwcHhcIlxuICAgIGNvbnRhaW5lci5zdHlsZS5yaWdodCA9IFwiMHB4XCJcbiAgICBjb250YWluZXIuc3R5bGUudG9wID0gXCIwcHhcIlxuICAgIGNvbnRhaW5lci5zdHlsZS5ib3R0b20gPSBcIjBweFwiXG4gICAgY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmQgPSBcIiNmZmZcIlxuICAgIGlmKGVsLnN0eWxlLnBvc2l0aW9uID09PSAnc3RhdGljJyB8fCAhZWwuc3R5bGUucG9zaXRpb24pe1xuICAgICAgICBlbC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcbiAgICB9XG4gICAgZWwuc3R5bGUub3ZlcmZsb3c9IFwiaGlkZGVuXCI7XG4gICAgY29uc3Qgdm5vZGUgPSBoKEVsU2tlbGV0b24se1xuICAgICAgYW5pbWF0ZWQ6dHJ1ZSxcbiAgICAgIC4uLmJpbmdpbmcudmFsdWVcbiAgICB9KVxuXG4gICAgcmVuZGVyKHZub2RlLGNvbnRhaW5lcilcblxuICAgIG1hcC5zZXQoZWwse1xuICAgICAgc2hvdygpe1xuICAgICAgICBlbC5zdHlsZS5vdmVyZmxvdz0gXCJoaWRkZW5cIlxuICAgICAgICBjb250YWluZXIuc3R5bGUuYmFja2dyb3VuZCA9ICBcIiNmZmZcIlxuICAgICAgICB2bm9kZS5jb21wb25lbnQucHJvcHMubG9hZGluZyA9IHRydWVcbiAgICAgIH0sXG4gICAgICBoaWRkZW4oKXtcbiAgICAgICAgZWwuc3R5bGUub3ZlcmZsb3c9IFwiYXV0b1wiXG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kID0gIFwiaW5oZXJpdFwiXG4gICAgICAgIHZub2RlLmNvbXBvbmVudC5wcm9wcy5sb2FkaW5nID0gZmFsc2VcbiAgICAgIH0sXG4gICAgICBkZXN0b3J5KCl7XG4gICAgICAgIHJlbmRlcihudWxsLGNvbnRhaW5lcikgLy8g5YaF6YOo57uE5Lu26L+b6KGM5Y246L29XG4gICAgICAgIGNvbnRhaW5lci5yZW1vdmUoKVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG4gIHVwZGF0ZWQoZWwsYmluZ2luZyl7XG4gICAgY29uc3Qgc2tlbGV0b24gPSAgbWFwLmdldChlbClcbiAgICBpZihiaW5naW5nLnZhbHVlLmxvYWRpbmcpe1xuICAgICAgc2tlbGV0b24uc2hvdygpXG4gICAgfWVsc2V7XG4gICAgICBza2VsZXRvbi5oaWRkZW4oKVxuICAgIH1cbiAgfSxcbiAgdW5tb3VudGVkKGVsLGJpbmdpbmcpe1xuICAgIGNvbnN0IHNrZWxldG9uID0gIG1hcC5nZXQoZWwpXG4gICAgc2tlbGV0b24uZGVzdG9yeSgpXG4gIH1cbn1cblxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGVsLWJ1dHRvbiBAY2xpY2s9XCJsb2FkaW5nID0hbG9hZGluZ1wiPnt7bG9hZGluZ319PC9lbC1idXR0b24+IFxuICA8aDEgdi1za2VsZXRvbj1cIntsb2FkaW5nOmxvYWRpbmcscm93czoxfVwiPjExMTExMTwvaDE+XG4gIDxkaXY+eHh4eHg8L2Rpdj4gXG48L3RlbXBsYXRlPlxuIiwiZWxlbWVudC1wbHVzLmpzIjoiaW1wb3J0IEVsZW1lbnRQbHVzIGZyb20gJ2VsZW1lbnQtcGx1cydcbmltcG9ydCB7IGdldEN1cnJlbnRJbnN0YW5jZSB9IGZyb20gJ3Z1ZSdcblxubGV0IGluc3RhbGxlZCA9IGZhbHNlXG5hd2FpdCBsb2FkU3R5bGUoKVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXBFbGVtZW50UGx1cygpIHtcbiAgaWYgKGluc3RhbGxlZCkgcmV0dXJuXG4gIGNvbnN0IGluc3RhbmNlID0gZ2V0Q3VycmVudEluc3RhbmNlKClcbiAgaW5zdGFuY2UuYXBwQ29udGV4dC5hcHAudXNlKEVsZW1lbnRQbHVzKVxuICBpbnN0YWxsZWQgPSB0cnVlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkU3R5bGUoKSB7XG4gIGNvbnN0IHN0eWxlcyA9IFsnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9lbGVtZW50LXBsdXNAbGF0ZXN0L2Rpc3QvaW5kZXguY3NzJywgJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vZWxlbWVudC1wbHVzQGxhdGVzdC90aGVtZS1jaGFsay9kYXJrL2Nzcy12YXJzLmNzcyddLm1hcCgoc3R5bGUpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKVxuICAgICAgbGluay5yZWwgPSAnc3R5bGVzaGVldCdcbiAgICAgIGxpbmsuaHJlZiA9IHN0eWxlXG4gICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCByZXNvbHZlKVxuICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIHJlamVjdClcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKGxpbmspXG4gICAgfSlcbiAgfSlcbiAgcmV0dXJuIFByb21pc2UuYWxsU2V0dGxlZChzdHlsZXMpXG59XG4iLCJ0c2NvbmZpZy5qc29uIjoie1xuICBcImNvbXBpbGVyT3B0aW9uc1wiOiB7XG4gICAgXCJ0YXJnZXRcIjogXCJFU05leHRcIixcbiAgICBcImpzeFwiOiBcInByZXNlcnZlXCIsXG4gICAgXCJtb2R1bGVcIjogXCJFU05leHRcIixcbiAgICBcIm1vZHVsZVJlc29sdXRpb25cIjogXCJCdW5kbGVyXCIsXG4gICAgXCJ0eXBlc1wiOiBbXCJlbGVtZW50LXBsdXMvZ2xvYmFsLmQudHNcIl0sXG4gICAgXCJhbGxvd0ltcG9ydGluZ1RzRXh0ZW5zaW9uc1wiOiB0cnVlLFxuICAgIFwiYWxsb3dKc1wiOiB0cnVlLFxuICAgIFwiY2hlY2tKc1wiOiB0cnVlXG4gIH0sXG4gIFwidnVlQ29tcGlsZXJPcHRpb25zXCI6IHtcbiAgICBcInRhcmdldFwiOiAzLjNcbiAgfVxufVxuIiwiUGxheWdyb3VuZE1haW4udnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBBcHAgZnJvbSAnLi9BcHAudnVlJ1xuaW1wb3J0IHsgc2V0dXBFbGVtZW50UGx1cyB9IGZyb20gJy4vZWxlbWVudC1wbHVzLmpzJ1xuc2V0dXBFbGVtZW50UGx1cygpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8QXBwIC8+XG48L3RlbXBsYXRlPlxuIiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9AdnVlL3J1bnRpbWUtZG9tQGxhdGVzdC9kaXN0L3J1bnRpbWUtZG9tLmVzbS1icm93c2VyLmpzXCIsXG4gICAgXCJAdnVlL3NoYXJlZFwiOiBcImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vQHZ1ZS9zaGFyZWRAbGF0ZXN0L2Rpc3Qvc2hhcmVkLmVzbS1idW5kbGVyLmpzXCIsXG4gICAgXCJlbGVtZW50LXBsdXNcIjogXCJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2VsZW1lbnQtcGx1c0BsYXRlc3QvZGlzdC9pbmRleC5mdWxsLm1pbi5tanNcIixcbiAgICBcImVsZW1lbnQtcGx1cy9cIjogXCJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2VsZW1lbnQtcGx1c0BsYXRlc3QvXCIsXG4gICAgXCJAZWxlbWVudC1wbHVzL2ljb25zLXZ1ZVwiOiBcImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vQGVsZW1lbnQtcGx1cy9pY29ucy12dWVAMi9kaXN0L2luZGV4Lm1pbi5qc1wiXG4gIH0sXG4gIFwic2NvcGVzXCI6IHt9XG59IiwiX28iOnt9fQ==)

```XML
<script setup>
import { ref,render,h } from 'vue'
import {ElSkeleton} from 'element-plus'

const loading = ref(true)

const map = new WeakMap()

const vSkeleton = {
  mounted(el,binging){
    const container = document.createElement("div") // 可以挂载不同的样式防止css等信息的污染
    el.appendChild(container)
    container.style.position = "absolute"
    container.style.left = "0px"
    container.style.right = "0px"
    container.style.top = "0px"
    container.style.bottom = "0px"
    container.style.background = "#fff"
    if(el.style.position === 'static' || !el.style.position){
        el.style.position = 'relative'
    }
    el.style.overflow= "hidden";
    const vnode = h(ElSkeleton,{
      animated:true,
      ...binging.value
    })

    render(vnode,container)

    map.set(el,{
      show(){
        el.style.overflow= "hidden"
        container.style.background =  "#fff"
        vnode.component.props.loading = true
      },
      hidden(){
        el.style.overflow= "auto"
        container.style.background =  "inherit"
        vnode.component.props.loading = false
      },
      destory(){
        render(null,container) // 内部组件进行卸载
        container.remove()
      }
    })
  },
  updated(el,binging){
    const skeleton =  map.get(el)
    if(binging.value.loading){
      skeleton.show()
    }else{
      skeleton.hidden()
    }
  },
  unmounted(el,binging){
    const skeleton =  map.get(el)
    skeleton.destory()
  }
}

</script>

<template>
  <el-button @click="loading =!loading">{{loading}}</el-button> 
  <h1 v-skeleton="{loading:loading,rows:1}">111111</h1>
  <div>xxxxx</div> 
</template>

```



