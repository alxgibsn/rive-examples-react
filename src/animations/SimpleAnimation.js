import React from 'react';
import loadRive from '../RiveLoader';

export default class SimpleAnimation extends React.Component {

  constructor(props) {
    super(props);
    this.animationContainer = React.createRef();
    this.resize = this.resize.bind(this);

    this.setCanvas = async (canvas) => {
      this.animationCanvas = canvas;
      if (!canvas) {
        return;
      }

      const { rive, file } = await loadRive(this.props.file);
      const { CanvasRenderer, LinearAnimationInstance, Alignment, Fit } = rive;
      // Get the default artboard.
      const artboard = this.props.artboard != null
        ? file.artboard(this.props.artboard)
        : file.defaultArtboard();

      // Find an animation.
      const animation = this.props.animation
        ? artboard.animation(this.props.animation)
        : artboard.animation('Untitled 1');

      // Make an animation instance (stores time and direction state
      // for a single animation). Make sure to call .delete on this
      // object when you are done with it.
      const animationInstance = new LinearAnimationInstance(animation);

      const ctx = canvas.getContext('2d', { alpha: false });
      const renderer = new CanvasRenderer(ctx);
      artboard.advance(0);
      artboard.draw(renderer);

      let lastTime = 0;

      function drawFrame(time) {
        // Check if canvas is on screen
        const rect = canvas.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          requestAnimationFrame(drawFrame);
          return;
        }

        if (!lastTime) {
          lastTime = time;
        }
        const elapsedSeconds = (time - lastTime) / 1000;
        lastTime = time;

        animationInstance.advance(elapsedSeconds);
        animationInstance.apply(artboard, 1.0);

        artboard.advance(elapsedSeconds);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        renderer.align(
          Fit.cover,
          Alignment.center,
          {
            minX: 0,
            minY: 0,
            maxX: canvas.width,
            maxY: canvas.height,
          },
          artboard.bounds
        );
        artboard.draw(renderer);
        ctx.restore();
        // eslint-disable-next-line no-undef
        requestAnimationFrame(drawFrame);
      }
      // eslint-disable-next-line no-undef
      requestAnimationFrame(drawFrame);
    };
  }

  componentDidMount() {
    // eslint-disable-next-line no-undef
    window.addEventListener('resize', this.resize);
    window.addEventListener('load', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    // eslint-disable-next-line no-undef
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('load', this.resize);
  }

  resize() {
    const rect = this.animationContainer.current.getBoundingClientRect();
    this.animationCanvas.width = rect.width;
    this.animationCanvas.height = rect.height;
  }

  render() {
    return (
      <div ref={this.animationContainer} className='OuterContainer'>
        <div className='InnerContainer'>
          <canvas ref={this.setCanvas} />
        </div>
      </div>
    );
  }
}
