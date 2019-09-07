# vue-pagination



## Install

```bash
$ npm install vue-pagination --save
```

## Usage

```html
<script>
import pagination from 'vue-pagination'

export default {
  components: { pagination },
  data() {
    return {
    	page: 14
    }
  },
  
  methods:{
  	handlePageChange(index) {
  		this.page = index;
  	}
  }
}
</script>

<template>
  <div>
     <pagination 
     list-style="v-pagination" 
     :invert-page-order="true" 
     :items="800" 
     :items-on-page="20" 
     class="light-theme" 
     :current-page="page" 
     :displayed-pages="5" 
     :edges="1" 
     @select-page="handlePageChange" 
     :disabled="false"></pagination>
  </div>
</template>
```
### Available options

| Prop | Description  | Type  | Default |
|------|--------------|-------|---------|
| items | Integer  | Default: 1 | Total number of items that will be used to calculate the pages. |
| itemsOnPage | Integer | Default: 1 | Number of items displayed on each page. |
| pages | Integer | Optional | If specified, items and itemsOnPage will not be used to calculate the number of pages.|
| displayedPages | Integer | Default: 5 | How many page numbers should be visible while navigating. Minimum allowed: 3 (previous, current & next)|
| edges | Integer | Default: 2 | How many page numbers are visible at the beginning/ending of the pagination.|
| currentPage | Integer | Default: 1 | Which page will be selected immediately after init.|
| hrefTextPrefix | String | Default: "#page-" | A string used to build the href attribute, added before the page number.|
| hrefTextSuffix | String | Default: empty string | Another string used to build the href attribute, added after the page number.|
| prevText | String | Default: "Prev" | Text to be display on the previous button.|
| prevText | String | Default: "Next" | Text to be display on the next button.|
| cssStyle | String | Default: "light-theme" | The class of the CSS theme.|
| format | Function | Optional | format the numbers. |
| disable | Boolean | Default: false | Disables pagination functionality. |

## ChangeLog 

[CHANGELOG](CHANGELOG.md)


## License

[MIT](https://github.com/mengxiong10/vue-pagination/blob/master/LICENSE)

Copyright (c) 2017-present argprj
