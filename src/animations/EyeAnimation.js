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

      const { rive, file } = await loadRive('eye.riv');
      const { CanvasRenderer, LinearAnimationInstance, Alignment, Fit } = rive;
      const artboard = file.defaultArtboard();

      const levitate = artboard.animation('levitate');
      const blink = artboard.animation('blink');
      const lookVertical = artboard.animation('look_vertical');
      const lookHorizontal = artboard.animation('look_horiztonal');
      const pupil = artboard.animation('pupil_shrink');
      const rotate1 = artboard.animation('rotate_1');
      const rotate2 = artboard.animation('rotate_2');

      const levitateInstance = new LinearAnimationInstance(levitate);
      const blinkInstance = new LinearAnimationInstance(blink);
      const lookVerticalInstance = new LinearAnimationInstance(lookVertical);
      const lookHorizontalInstance = new LinearAnimationInstance(lookHorizontal);
      const pupilInstance = new LinearAnimationInstance(pupil);
      let rotateInstance = new LinearAnimationInstance(rotate1);

      blinkInstance.time = 1;
      let rotateCount = 0;

      const ctx = canvas.getContext('2d', { alpha: true });
      const renderer = new CanvasRenderer(ctx);
      artboard.advance(0);
      artboard.draw(renderer);

      let lastTime = 0;

      canvas.addEventListener('focus', (e) => {
        lookVerticalInstance.time = e.detail.y / window.innerHeight;
        lookHorizontalInstance.time = e.detail.x / window.innerWidth;
        lookVerticalInstance.apply(artboard, 1.0);
        lookHorizontalInstance.apply(artboard, 1.0);

        const d = Math.hypot(
          e.detail.x - window.innerWidth / 2, 
          e.detail.y - window.innerHeight / 2
        )

        const c = Math.hypot(
          window.innerWidth / 2, 
          window.innerHeight / 2
        )

        pupilInstance.time = d / c;
        pupilInstance.apply(artboard, 1.0);
      });
      
      canvas.addEventListener('mousedown', () => {
        blinkInstance.time = 0;
      });

      setInterval(() => {
        rotateInstance = new LinearAnimationInstance(
          rotateCount % 2 === 0 ? rotate2 : rotate1);
        rotateCount++;
      }, 3000);

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

        levitateInstance.advance(elapsedSeconds);
        levitateInstance.apply(artboard, 1.0);

        blinkInstance.advance(elapsedSeconds);
        blinkInstance.apply(artboard, 1.0);

        rotateInstance.advance(elapsedSeconds);
        rotateInstance.apply(artboard, 1.0);

        artboard.advance(elapsedSeconds);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        renderer.align(
          Fit.contain,
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
    clearInterval();
    // eslint-disable-next-line no-undef
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('load', this.resize);
  }

  onFrequencyUpdate(value) {
    this.animationCanvas.dispatchEvent(
      new CustomEvent('amplitude', {
        detail: { amplitude: value },
      })
    );
  }

  resize() {
    const rect = this.animationContainer.current.getBoundingClientRect();
    this.animationCanvas.width = rect.width;
    this.animationCanvas.height = rect.height;
  }

  onMouseMove(e) {
    this.animationCanvas.dispatchEvent(
      new CustomEvent('focus', {
        detail: { x: e.clientX, y: e.clientY },
      })
    );
  }

  render() {
    return (
      <div ref={this.animationContainer} 
      className='AnimationContainer'
      onMouseMove={(e) => this.onMouseMove(e)}>
        <canvas ref={this.setCanvas} />
      </div>
    );
  }
}
