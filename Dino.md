## Chrome小恐龍

### 無敵模式（無視障礙物）
```javascript 
Object.defineProperty(Runner.prototype, 'gameOver', {
  value: function(){},
})
```

### 加入文字
1. 
```javascript
[...document.querySelectorAll('*')].forEach(el => {
  if (el.childNodes.length === 1 && el.innerText.includes('按下空格')) {
    el.innerText += '加上文字';
  }
});
```
2.
直接在Element的HTML找到對應的程式碼改
