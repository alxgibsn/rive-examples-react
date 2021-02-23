import { useRef, useEffect } from 'react';
import { RiveAnimation } from 'rive-js';

const KnightAnimation = () => {

  const canvas = useRef<HTMLCanvasElement>(null)
  const container = useRef<HTMLDivElement>(null)
  const animation = useRef<typeof RiveAnimation>(null)

  useEffect(() => {
    let sunshine: boolean = true;

    animation.current = new RiveAnimation({
      src: '/knight.riv',
      canvas: canvas.current,
      autoplay: true,
    });

    const toggle = () => {
      animation.current.play(sunshine ? 'day_night' : 'night_day');
      sunshine = !sunshine;
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.current?.addEventListener('mousedown', toggle);
    return () => {
      animation.current?.stop()
      window.removeEventListener('resize', resize);
    };
  }, []);

  const resize = () => {
    if (container.current && canvas.current) {
      const { width, height } = container.current.getBoundingClientRect();
      canvas.current.width = width;
      canvas.current.height = height;
    }
  };

  return (
    <div>
      <div ref={container} className='OuterContainer'>
        <div className='InnerContainer'>
          <canvas ref={canvas} />
        </div>
      </div>
      <p>Click the knight</p>
    </div>
  );
}

export default KnightAnimation;
