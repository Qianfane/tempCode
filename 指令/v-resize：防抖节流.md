# v\-resize：防抖节流

自定义指令：宽高自适应



# 实现

核心是 内置了 防抖

```JavaScript
export default {
  bind(el, binding) {
    let width = '', height = '';
    function isReize() {
      const style = document.defaultView.getComputedStyle(el);
      if (width !== style.width || height !== style.height) {
        binding.value();  // 执行传入的方法
      }
      width = style.width;
      height = style.height;
     }
     el.__timer__ = setInterval(isReize, 300); // 周期性监听元素是否改变
  },
  unbind(el) {
    clearInterval(el.__timer__);
  }
}
```



