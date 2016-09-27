# Pager

The `<x-pager>` component calculates pagination on a colletion of elements. In order to use it you need to provide the total number of elements to paginate using the itemCount property.

If you put an element with a class name `pager-prev` or `pager-next` like the ```<button>``` in the example below, they will work as the pager controls.

When the pager has moved, it will trigger the `moved` event with the current page, page size and offset values.

## Usage

```html
<x-pager itemCount="18">
  <button class="pager-prev">Prev</button>
  <button class="pager-next">Next</button>
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




