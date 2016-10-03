# Pager

The `<x-pager>` component calculates pagination on a colletion of elements. In order to use it you need to provide the total number of elements to paginate using the ```item-count``` property.

If you put an element inside the pager with a class name `prev` or `next` like the ```<button>``` in the example below, they will work as the pager controls.

When the pager has moved, it will trigger the `moved` event with the current page, page size and offset values.

## Usage

```html
<x-pager item-count="18">
  <button class="prev">Prev</button>
  <button class="next">Next</button>
</x-pager>
```

```javascript
var pager = document.querySelector('x-pager');

xtag.addEvent(pager, 'moved', function(event){
/* 
   Perform an action after the pager 
   moves using the following values: 
      event.detail.page
      event.detail.pageSize
      event.detail.offset       
*/
});

// Move to the next page.
pager.next();
```

## Methods

### `next`

Moves the pager to the next page.

### `prev`

Moves the pager to the previous page.

### `to`

Moves the pager to the specified page if possible.

### `render`

Renders the navigation links inside the element.

## Attributes

### `pageSize`

The size of the pages.

### `itemCount`

The total number of items.

### `loop`

Causes the pager to return to the first page after reaching the last page.

## Events

### `moved`

Triggered when the pager moves to a new page.

### `first`

Triggered after the pager has moved to the first page.

### `last`

Triggered after the pager has moved to the last page.
