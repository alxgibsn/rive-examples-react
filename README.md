# Rive 2 React Component Example

Here's a simple example of how to create and use a React component for Rive 2. This uses Rive's [Wasm runtime](https://github.com/rive-app/rive-wasm).

There are two sample components:

## SimpleAnimation

`SimpleAnimation` continuously plays a looping animation. Provide it with the url to the file and the name of the animation to play:

```js
<SimpleAnimation file='my_animation.riv' animation='MyAnimation' />
```

## KnightAnimation

The `KnightAnimation` shows how to add custom behavior to an animation. When the animation is clicked on it toggles between two animations, mixing in, and transforming between, two animations in a file.

## Running the Example

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

```js
npm update
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