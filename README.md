# w2a 微信转支付宝
## 目前发现不支持转换情况列表

1. icon[type=circle],icon[type=info_circle] 支付宝小程序不支持
2. input onInput不支持return
```js
 bindReplaceInput: function(e) {
    var value = e.detail.value
    var pos = e.detail.cursor
    if(pos != -1){
      //光标在中间
      var left = e.detail.value.slice(0,pos)
      //计算光标的位置
      pos = left.replace(/11/g,'2').length
    }

    //直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value: value.replace(/11/g,'2'),
      cursor: pos
    }

    //或者直接返回字符串,光标在最后边
    //return value.replace(/11/g,'2'),
  }
```
3. 各种不支持元素class、style
4. picker 不支持mode

