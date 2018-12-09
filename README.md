# Clickety

Make rich typewriter effects

## Demo

[live demo](https://timtnleeproject.github.io/Clickety/index.html)

## Installation


### NodeJS

```linux
npm install --save clickety
```

### Script

Browser scripts at `/dist/clickety.min.js`

This library uses `Promise`, so you might need `promise-polifill` for **IE**.

## Usage

Create a `typer` instance.

```javascript
const typer = new Clickety('.area')
```

## Example

```html
<div class="area"></div>
```

```javascript
const typer = new Clickety(".area")

//sequences of actions
typer
    .init()
    .type("Hello! ", 150)
    .type("this is ", 100)
    .type("clickety", 200)
    .prev(7, 80)
    .backspace(1, 100)
    .type("C", 200)
    .prev(9, 80)
    .enter(100)
    .end(500)
    .type(".",80)
```

## Constructor

```javascript
constructor(element, settings)
```

### parameters

|name|description|type|default|
|-|-|-|-|
|element|Set the container.|DOM Eelement||
|settings.container_class|Set the class of the container.|String|`'clickety_container'`|
|settings.line_class|Set the class of each line.|String|`'clickety_line'`|
|settings.clickety_text|Set the class of each text block.|String|`'clickety_text'`|
|settings.cursor_class|Set the class of the cursor.|String|`'clickety_cursor'`|
|settings.cursor|Set the innerHTML of the cursor.|String|`'|'`|

## Methods

Here are `typer` instance's methonds.

All parameters about **time** are using milliseconds.

|method|description|parameters|
|-|-|-|
|init|Initialize the typeing area, this must be called to init the container.|`init()`|
|type|Type words.|`type(string, speed)`|
|pause|pause|`pause(ms)`|
|enter|Press enter.|`enter(delay)`|
|backspace|Press backspace.|`backspace(times, speed)`|
|delete|Press delete.|`delete(times, speed)`|
|prev|Press left.|`prev(times, speed)`|
|next|Press right.|`next(times, speed)`|
|end|Move cursor to the end of the line.|`end(delay)`|
|home|Move cursor to the start of the line.|`home(delay)`|
|then|Add callback to Promise chain.|`then(callback)`|

## CSS

Css file at `/dist/clickety.css`,

or you can just copy below to your custom style sheets.

```css
.clickety_text {
    display: inline-block;
    min-height: 1rem;
}

.clickety_cursor {
    margin: 0 -0.5rem;
    display: inline-block;
    width: 1rem;
    text-align: center;
    animation: blink 1.2s infinite;
}

@keyframes blink {
    0%,60% {
        opacity: 1;
    }
    61%, 100% {
        opacity: 0;
    }
}
```
