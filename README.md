# Rive Web Runtime Examples

A few examples of implementing Rive animations on the web! Includes examples with both the JS and WASM variants.

[Rive's JS runtime](https://github.com/rive-app/rive-js) is the simplest way to get your animations running in the web. Alternatvely, make use of [Rive's WASM runtime](https://github.com/rive-app/rive-canvas) for lower level control of your animations.

Currently, there are theee sample animations:

## MartyAnimation

`MartyAnimation` continuously plays a looping animation:

```ts
animation = new RiveAnimation({
  src: '/marty.riv',
  canvas: canvas.current,
  autoplay: true,
});
```

## KnightAnimation

`KnightAnimation` introduces multiple animations with basic interaction. When the animation is clicked, it toggles between two animations, mixing in, and transforming between, multiple animations within the Rive file.

```ts
const toggle = () => {
  animation.current.play(sunshine ? 'day_night' : 'night_day');
  sunshine = !sunshine;
};
```

## EyeAnimation

The `EyeAnimation` demonstrates managing the run loop with the `rive-canvas` package for maximum control of a range of animations within the Rive file. It mixes a range of animations that are either looping, triggered by clicking, or mapped to the cursor position.

```ts
instances.lookY.time = e.clientY / window.innerHeight;
instances.lookX.time = e.clientX / window.innerWidth;
instances.lookY.apply(artboard, 1.0);
instances.lookX.apply(artboard, 1.0);
```

## Running the examples

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

```js
npm install
```
will pull down the necessary dependencies.

```js
npm start
```
runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits and you will also see any lint errors in the console.

## Notes on web bundling and deploying

* Rive's web runtime uses Wasm to create a small, performant engine. Not all web bundlers play nicely with Wasm; if you run into difficulties, check your pipeline's documentation. In this example, we load the Wasm file from the *unpkg* cdn, but could just as easily load it from your hosting environment. Take a look at the [RiveLoader.js](https://github.com/alxgibsn/rive-examples-react/blob/main/src/RiveLoader.js) source file. 

* If you get an error along the lines of ```Module not found: Can't resolve 'fs'``` and you're using webpack, try adding ```"node": { "fs": "empty" }``` to you config (*webpack.config.js*).