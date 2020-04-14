# Rambutan

Rambutan is a vertical slide control. Minimal styling, minimal options. Rambutan automatically resizes to the dimensions of the parent element (see the styling).

The contents of the background (or before) and foreground (or after) can be images, backgrounds, colors or HTML elements.

Rambutan is not really a plug-n-play script. It will need a little bit of tweaking of the styling. And it assumes you know what you are doing script-wise. But if that won't hold you back: feel free to use it (see the [License](#license) for usage).

## Usage

Add the `dist/rambutan.css` to your styles and `dist/rambutan.js` to your scripts.

The script will automatically make a slider from all elements with a `rambutan` class. See example.html for a basic example.

Make sure there always is a foreground and background element.

You can also add an independent slider through javascript. See this example:

```<script>
slider = new rambutan.rambutanslider('#myrambutanslider',
    [
      document.getElementById('DOMelementbackground'),
      document.getElementById('DOMelementforeground')
    ],
    {
        startingPosition: "50%",
        animate: true,
        callbackOnInit: null,
        callbackOnUpdate: null
    });
slider._prepare();
</script>```

## Callbacks

There are two callback functions you can use: once on initialisation and on every update / interaction. Pass the function as an option to the rambutanslider.

If you are calling a function every update, please make sure it's not resouce intensive. Otherwise you should use a debounce or throttle function.

## Todo

Some development that's still to do:

* Add build / minified scripts
* Test in older browsers

## Hat tips

### Juxtapose

This vertical slider is heavily inspired by: [Juxtapose](https://github.com/NUKnightLab/juxtapose). Because Juxtapose is aimed at (mostly horizontal) images, Rambutan fills the need for a more bare-bones approach.

### Colors

Color scheme used in examle by the lovely [Happy Hues](https://www.happyhues.co).

(## Licence)

Mozilla Public License Version 2.0 (MPL-2.0)
