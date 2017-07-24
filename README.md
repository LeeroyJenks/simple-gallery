# simple-gallery
A simple jQuery gallery plugin with touch and auto scroll support.

## Demo
[plugins.getdans.info/simple-gallery](http://plugins.getdans.info/simple-gallery)

## Installation
Download from GitHub

### Requirements
jQuery

### Use
```html
<script>
    $(document).ready(function(){
        $('.image-gallery').simpleGallery({
            slidesContainer: '.slides'
        });
    });
</script>
```
### Description

Some minor CSS must be used in order to get the gallery working properly. You'll need to define the width of the image gallery. `slidesContainer` must be defined for the gallery to work properly.

The gallery includes dots navigation as well as arrows, which you can choose to remove.<br>
You can also include titles and descriptions to each slide. To do so, you will need to add them as data values to each slide. For example, if a slide has a title and description:<br>
`<li class="slide" data-title="Some Title" data-description="Some Description"></li>`<br>
You will then need to define the data attributes in the `description` option. For the example above, you would need to:<br>
`description: ['title', 'description']`<br>
simple-gallery will then create those fields and populate them in accordance to the respective slide. You will need to style the descriptions.

### Example

```html
<style>
    .image-gallery{
        display: block;
        position: relative;
        margin: 0 auto;
        width: 85%;
        opacity: 0;
        -webkit-transition: opacity 300ms;
        -moz-transition: opacity 300ms;
        -ms-transition: opacity 300ms;
        transition: opacity 300ms;
    }
    
    .image-gallery .slides{
        width: 100%;
        display: block;
        position: relative;
        padding: 0;
        margin: 0;
        list-style: none;
    }
    
    .image-gallery .slides .slide{
        width: 100%;
        height: auto;
        display: block;
        position: relative;
    }
    
    .image-gallery .slides .slide img{
        display: block;
        height: auto;
        width: 100%;
    }
    
    .image-gallery .gallery-description{
        display: block;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: #1565C0;
        color: #fff;
        padding: 10px 20px;
        z-index: 1;
        letter-spacing: 0.5px;
    }
</style>

<div class="image-gallery">
    <ul class="slide-container">
        <li class="slide" data-title="title 1"><img src="IMAGE_ONE.jpg" alt="Image 1"/></li>
        <li class="slide" data-title="title 2"><img src="IMAGE_TWO.jpg" alt="Image 2"/></li>
        <li class="slide"><img src="IMAGE_THREE.jpg" alt="Image 3"/></li>
    </ul>
</div>

<script>
    /* allow page to load before running simpleGallery */
    $(window).on('load', function() {
        $('.image-gallery').simpleGallery({
            slidesContainer: '.slide-container',
            description: ['title']
            dotsPositionY: 'bottom',
            arrowsColor: '#fff',
            dotsColor: '#fff',
            autoScroll: true,
            scrollSpeed: 5000,
            scrollStartDelay: 5000,
            restartDelay: 5000
        })
        .css({opacity: 1});
    });
</script>
```

### Options

Options            | Definition
------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
`slidesContainer`  | Parent container of slides.<br>`default: '.images-list'`
`adaptiveHeight`   | Whether the gallery height should adapt to the image being displayed (`true`) or if the image should adapt to the gallery height (`false`)<br>`default: false`
`description`      | Read description above for full details. List of data atributes used in description as an array. ie `['title', 'description']`.<br>`default: false`
`navigation`       | `'dots'`, `'arrows'`, `'both'`<br>Whether to use dots, arrows, or both.<br>`default: 'both'`
`dotsPositionX`    | `'left'`, `'center'`, `'right'`<br>Dots position in gallery container.<br>`default: 'center'`
`dotsPositionY`    | `'top'`, `'center'`, `'bottom'`<br>Dots position in gallery container.<br>`default: 'center'`
`arrowsColor`      | `default: '#000'`
`dotsColor`        | `default: '#000'`
`swipe`            | `'horizontal'`, `'vertical'`<br>Will also affect dots being vertical or horizontal.<br>**`'vertical'` currently broken due to inability to prevent scroll**<br>`default: 'horizontal'`
`autoScroll`       | Whether gallery scrolls through slides automatically.<br>`default: false`
`scrollSpeed`      | Time between image change in milliseconds.<br>`default: 3000`
`scrollStartDelay` | Time before gallery begins scrolling in milliseconds.<br>`default: 3000`
`scrollRestart`    | Whether auto scroll restarts once the user interacts with the gallery.<br>`default: true`
`restartDelay`     | If `scrollRestart` is `true`, how long after the user interacts the gallery should start scrolling again, in milliseconds.<br>`default: 3000`
