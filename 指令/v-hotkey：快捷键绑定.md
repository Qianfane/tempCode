# v\-hotkey：快捷键绑定

自定义指令：快捷键绑定

快捷键绑定\-指令版

快捷键管理，可以配合模型等概念统一沟通

# 实现

```JavaScript
// directives/hotkey.js
export const hotkey = {
  mounted(el, binding) {
    const { value, modifiers } = binding;
    
    // 支持单个快捷键或多个快捷键数组
    const hotkeys = Array.isArray(value) ? value : [value];
    
    // 处理修饰键
    const hasCtrl = modifiers.ctrl || modifiers.control;
    const hasAlt = modifiers.alt;
    const hasShift = modifiers.shift;
    const hasMeta = modifiers.meta;
    
    // 存储事件处理函数引用，以便后续移除
    const handler = (e) => {
      // 检查修饰键是否匹配
      if (
        (hasCtrl === e.ctrlKey) &&
        (hasAlt === e.altKey) &&
        (hasShift === e.shiftKey) &&
        (hasMeta === e.metaKey)
      ) {
        // 检查按键是否匹配
        for (const hotkey of hotkeys) {
          if (e.key.toLowerCase() === hotkey.toLowerCase()) {
            e.preventDefault();
            e.stopPropagation();
            
            // 如果指令绑定了函数，则调用该函数
            if (typeof binding.value === 'function') {
              binding.value(e);
            } else {
              // 否则触发元素的点击事件
              el.click();
            }
            break;
          }
        }
      }
    };
    
**    // 保存事件处理函数和元素引用**
**    // 注：此处可以使用 new Map 代替**
    el.__hotkeyHandler = handler;
    
    // 绑定事件监听器
    // 此处需要判断，绑定范围
   ** document.addEventListener('keydown', handler);**
  },
  
  unmounted(el) {
    // 移除事件监听器
    if (el.__hotkeyHandler) {
      document.removeEventListener('keydown', el.__hotkeyHandler);
      delete el.__hotkeyHandler;
    }
  },
};

export default {
  install(app) {
    app.directive('hotkey', hotkey);
  }
};  
```

