const insertAfter = function(newNode,node) {
  node.parentElement.insertBefore(newNode, node.nextElementSibling)
}

insertBefore = function(newNode,node) {
  node.parentElement.insertBefore(newNode,node)
}

const remove = function(node) {
  node.parentElement.removeChild(node)
}

function Clickety(el, settings={}) {
  this.SETTINGS = {
    container_class: 'clickety_container',
    line_class: 'clickety_line',
    text_class: 'clickety_text',
    cursor_class: 'clickety_cursor',
    cursor: '|'
  }
  for(let k in settings) {
    if(this.SETTINGS[k]) this.SETTINGS[k] = settings[k]
  }

  
  this.promises = new Promise((res,_rej)=>{
    res()
  })
  
  this.container = document.querySelector(el)
}

Clickety.prototype.init = function() {
  if(this.container.firstChild) this.clear()
  this.cursor = this.createCursor()
  this.pointer = this.createText()
  this.container.classList.add(this.SETTINGS.container_class)
  this.createNewLine()
  return this
}

Clickety.prototype.clear = function(){
  while(this.container.firstChild) {
    remove(this.container.firstChild)
  }
}

Clickety.prototype.createLine = function(){
  const line = document.createElement('DIV')
  line.classList.add(this.SETTINGS.line_class)
  return line
}

Clickety.prototype.createCursor = function(){
  const cursor = document.createElement('span')
  cursor.classList.add(this.SETTINGS.cursor_class)
  cursor.innerHTML = this.SETTINGS.cursor
  return cursor
}

Clickety.prototype.createText = function(){
  const text = document.createElement('SPAN')
  text.classList.add(this.SETTINGS.text_class)
  return text
}

Clickety.prototype.createNewLine = function(){
  const line = this.createLine()
  const text = this.createText()
  const existLine = this.cursor.parentElement
  line.appendChild(text)
  insertAfter(this.cursor, text)
  this.pointer = text
  if(existLine) insertAfter(line, existLine)
  else this.container.appendChild(line)
}

Clickety.prototype.insertPromiseChain = function(promise_fn) {
  this.promises = this.promises.then(()=>{
    return promise_fn()
  })
}

Clickety.prototype.type = function(text, speed=0){
  
  function* makeTyping(){
    for(let char of text) {
      yield char
    }
  }
  
  const promise_fn = () => new Promise((res,_rej)=>{
    let itr = makeTyping()
    let result = itr.next()

    const typing = ()=> setTimeout(()=>{
      if(result.value===" ") this.pointer.innerHTML += "&nbsp"
      else this.pointer.innerText += result.value

      result = itr.next()
      
      if(!result.done) typing()
      else res()
    }, speed)

    typing()
  })
  
  this.insertPromiseChain(promise_fn)

  return this
}

Clickety.prototype.pause = function(time=0) {
  const promise_fn = ()=>new Promise((res,_rej)=>{
    setTimeout(()=>{
      res()
    }, time)
  })

  this.insertPromiseChain(promise_fn)

  return this
}

Clickety.prototype.enter = function(time=0){
  const promise_fn = () => new Promise((res,_rej)=>{
    setTimeout(()=>{
      const text_after = this.cursor.nextElementSibling
      this.createNewLine()
      if(text_after) insertAfter(text_after, this.cursor)
      res()
    }, time)
  })

  this.insertPromiseChain(promise_fn)

  return this
}

Clickety.prototype.backspace = function(times=1,speed=0){
  function *makeitr(){
    for(let i=0;i<times;i++){
      yield i
    }
  }
 
  const promise_fn = () => new Promise((res,_rej)=>{
    const itr = makeitr()
    let result = itr.next()
    
    const moveToPrevLine = ()=>{
      const thisLine = this.pointer.parentElement
      const prevLine = thisLine.previousElementSibling
      if(!prevLine) return
      
      remove(thisLine)
      
      const prevText = prevLine.lastChild
      insertAfter(this.cursor,prevText)
      this.pointer = prevText
    }

    const del = ()=> setTimeout(()=>{
      if(this.pointer.innerText.length === 0) moveToPrevLine()
      else {
        const str = this.pointer.innerText
        this.pointer.innerText = str.substring(0, str.length-1)
      }

      result = itr.next()
      
      if(!result.done) del()
      else res()

    }, speed)
    del()
  })

  this.insertPromiseChain(promise_fn)

  return this
}

Clickety.prototype.delete = function(times=1,speed=0){
  function *makeitr(){
    for(let i=0;i<times;i++){
      yield i
    }
  }
 
  const promise_fn = () => new Promise((res,_rej)=>{
    const itr = makeitr()
    let result = itr.next()
    
    const  indent= ()=>{
      const thisLine = this.pointer.parentElement
      const nextLine = thisLine.nextElementSibling
      if(!nextLine) return

      const nextLineText = nextLine.firstChild
      
      insertAfter(nextLineText, this.cursor)
      
      remove(nextLine)
    }

    const del = ()=> setTimeout(()=>{
      const textAfter = this.cursor.nextElementSibling
      if(!textAfter) indent()
      else {
        const str = textAfter.innerText
        const delStr = str.substring(1, str.length)
        if(delStr.length > 0) textAfter.innerText = delStr
        else remove(textAfter)
      }

      result = itr.next()
      
      if(!result.done) del()
      else res()

    }, speed)
    del()
  })

  this.insertPromiseChain(promise_fn)

  return this
}

Clickety.prototype.prev = function(times=1, speed=0) {
  
  const itr = (function* (){
    for(let i=0;i<times;i++) {
      yield i
    }
  })()

  let result = itr.next()
  
  const promise_fn = ()=> new Promise((res,_rej)=>{
    
    const move = ()=> setTimeout(() => {
      
      const prevText = this.cursor.previousElementSibling
      const str = prevText.innerText
      
      const indent = ()=>{
        const prevLine = this.cursor.parentElement.previousElementSibling
        if(!prevLine) return
        this.pointer = prevLine.lastChild
        insertAfter(this.cursor, this.pointer)
        remove(prevText)
      }

      if(str.length === 0 ) indent()
      else {
        const nextText = this.cursor.nextElementSibling || (function(){
          const text = this.createText()
          insertAfter(text, this.cursor)
          return text
        }.bind(this))()
        prevText.innerText = str.substring(0, str.length - 1)
        nextText.innerText = str[str.length-1] + nextText.innerText
      }

      result = itr.next()
      if(!result.done) move()
      else res()
    }, speed);

    move()
  })
  
  this.insertPromiseChain(promise_fn)

  return this
}

Clickety.prototype.next = function(times=1, speed=0){
  
  const itr = (function* (){
    for(let i=0;i<times;i++) {
      yield i
    }
  })()

  let result = itr.next()
  
  const promise_fn = ()=> new Promise((res,_rej)=>{
    
    const move = ()=> setTimeout(() => {
      
      const nextText = this.cursor.nextElementSibling
      const prevText = this.pointer

      const indent = () => {
        const nextLine = this.cursor.parentElement.nextElementSibling
        if(!nextLine) return
        this.pointer = this.createText()
        insertBefore(this.pointer, nextLine.firstChild)
        insertAfter(this.cursor, this.pointer)
      }

      if(!nextText) indent()
      else {
        const str = nextText.innerText
        prevText.innerText += str[0]
        if(str.length === 1) remove(nextText)
        else nextText.innerText = str.substring(1, str.length)
      }

      result = itr.next()
      if(!result.done) move()
      else res()
    }, speed);

    move()
  })
  
  this.insertPromiseChain(promise_fn)

  return this
}

Clickety.prototype.end = function(time=0){
  
  const promise_fn = ()=> new Promise((res, _rej)=>{
    setTimeout(()=>{
      const textAfter =  this.cursor.nextElementSibling
      if(textAfter) {
        this.pointer.innerText += textAfter.innerText
        remove(textAfter)
      }
      res()
    }, time)
  })

  this.insertPromiseChain(promise_fn)

  return this
}

Clickety.prototype.home = function(time=0){
  
  const promise_fn = ()=> new Promise((res, _rej)=>{
    setTimeout(()=>{
      const str = this.pointer.innerText
      if(str.length !== 0) {
        const nextText = this.cursor.nextElementSibling || (function(){
          const text = this.createText()
          insertAfter(text, this.cursor)
          return text
        }.bind(this))()
        nextText.innerText = str + nextText.innerText
        this.pointer.innerText = ""
      }
      res()
    }, time)
  })

  this.insertPromiseChain(promise_fn)

  return this
}

Clickety.prototype.then = function(fn) {
  
  this.insertPromiseChain(fn)

  return this
}

module.exports = Clickety