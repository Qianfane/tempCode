# v\-Clampy：根据文案，获取宽度

自定义指令：截断

```JavaScript
<p v-clampy="3">Long text to clamp here</p>
```



注：非css截断，而是文本长度计算后的截断

# 实现

http://github\.com/clampy\-js/vue\-clampy



本质是使用 Clampy 库进行实现的，核心是创建 **临时元素** 进行测量

```JavaScript
// demo
function clamp(element, options) {
  const { clamp, truncationChar, truncationHTML } = options;
  
  // 如果未指定截断行数或高度，直接返回
  if (!clamp || clamp === 'auto') return;
  
  // 保存原始内容用于重置
  if (!element._clampyOriginalContent) {
    element._clampyOriginalContent = element.innerHTML;
  }
  
  // 重置内容
  element.innerHTML = element._clampyOriginalContent;
  
  // 处理按行数截断
  if (typeof clamp === 'number') {
    return clampByLines(element, clamp, truncationChar, truncationHTML);
  }
  
  // 处理按高度截断
  if (clamp === 'fit' || clamp.endsWith('px')) {
    const maxHeight = typeof clamp === 'string' ? parseFloat(clamp) : null;
    return clampByHeight(element, maxHeight, truncationChar, truncationHTML);
  }
  
  return element;
}

// 按行数截断
function clampByLines(element, lineCount, truncationChar, truncationHTML) {
  // 获取行高和元素高度限制
  const lineHeight = getLineHeight(element);
  const maxHeight = lineHeight * lineCount;
  
  return clampByHeight(element, maxHeight, truncationChar, truncationHTML);
}

// 按高度截断
function clampByHeight(element, maxHeight, truncationChar, truncationHTML) {
  // 如果元素内容已经小于最大高度，无需截断
  if (element.offsetHeight <= maxHeight) {
    return element;
  }
  
  // 创建临时元素用于测量
  const tempElement = createTempElement(element);
  tempElement.innerHTML = element.innerHTML;
  
  // 逐词截断直到满足高度要求
  let content = element.innerHTML;
  let words = content.split(' ');
  let truncated = false;
  
  while (words.length > 0 && !truncated) {
    // 移除一个词并尝试
    words.pop();
    tempElement.innerHTML = `${words.join(' ')} ${truncationChar}`;
    
    if (tempElement.offsetHeight <= maxHeight) {
      // 找到合适的截断点
      element.innerHTML = `${words.join(' ')} ${truncationChar}`;
      truncated = true;
    }
  }
  
  return element;
}
```

```JavaScript
// 获取元素行高
function getLineHeight(element) {
  let lineHeight = window.getComputedStyle(element).lineHeight;
  if (lineHeight === 'normal') {
    // 对于 'normal'，使用约 1.2 倍的字体大小
    const fontSize = parseFloat(window.getComputedStyle(element).fontSize);
    lineHeight = fontSize * 1.2;
  }
  return parseFloat(lineHeight);
}

// 创建临时元素用于测量
function createTempElement(element) {
  const tempElement = document.createElement(element.tagName);
  tempElement.style.cssText = `
    position: absolute;
    visibility: hidden;
    height: auto;
    width: ${element.offsetWidth}px;
    padding: 0;
    margin: 0;
    white-space: normal;
    overflow: visible;
  `;
  
  // 复制样式
  const computedStyle = window.getComputedStyle(element);
  Array.from(computedStyle).forEach(prop => {
    tempElement.style[prop] = computedStyle[prop];
  });
  
  element.parentNode.appendChild(tempElement);
  return tempElement;
}
```

