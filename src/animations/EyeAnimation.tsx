import { useRef, useEffect } from 'react';
import loadRive from '../RiveLoader';
import { 
  LinearAnimationInstance, 
  CanvasRenderer, 
  Alignment, 
  Fit 
} from 'rive-canvas';

interface Instances {
  levitate: typeof LinearAnimationInstance;
  blink: typeof LinearAnimationInstance;
  lookY: typeof LinearAnimationInstance;
  lookX: typeof LinearAnimationInstance;
  pupil: typeof LinearAnimationInstance;
  rotate: typeof LinearAnimationInstance;
}

interface AlignFit {
  alignment?: typeof Alignment;
  fit?: typeof Fit;
}

const EyeAnimation = () => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {

    let instances: Instances,
      ctx: CanvasRenderingContext2D | null,
      renderer: typeof CanvasRenderer,
      alignFit: AlignFit,
      requestId: number,
      artboard: any,
      lastTime = 0;

    const setCanvas = async (canvas: HTMLCanvasElement | null) => {
      if (!canvas) {
        return;
      }
  
      const { rive, file } = await loadRive('eye.riv');
      const { CanvasRenderer, LinearAnimationInstance, Alignment, Fit } = rive;
      const getInstance = (animationName: string) => {
        if (artboard) {
          return new LinearAnimationInstance(
            artboard.animation(animationName)
          );
        }
      }
      artboard = file.defaultArtboard();
      alignFit = {
        alignment: Alignment.center,
        fit: Fit.cover
      };

      instances = {
        levitate: getInstance('levitate'),
        blink: getInstance('blink'),
        lookY: getInstance('look_vertical'),
        lookX: getInstance('look_horiztonal'),
        pupil: getInstance('pupil_shrink'),
        rotate: getInstance('rotate_1'),
      }
  
      let rotateCount = 0;
      instances.blink.time = 1;
      ctx = canvas.getContext('2d', { alpha: true });
      renderer = new CanvasRenderer(ctx);
      artboard.advance(0);
      artboard.draw(renderer);
  
      setInterval(() => {
        const rotateAnimation = 
          artboard.animation(`rotate_${rotateCount % 2 === 0 ? 2 : 1}`);
        instances = {
          ...instances,
          rotate: new LinearAnimationInstance(rotateAnimation),
        }
        rotateCount++;
      }, 3000);
  
      requestId = requestAnimationFrame(drawFrame);
    };

    const drawFrame = (time: number) => {
      if (!ctx || !canvas.current) {
        return;
      }
  
      if (!lastTime) {
        lastTime = time;
      }
      const elapsedSeconds = (time - lastTime) / 1000;
      lastTime = time;
  
      instances.levitate.advance(elapsedSeconds);
      instances.levitate.apply(artboard, 1.0);
  
      instances.blink.advance(elapsedSeconds);
      instances.blink.apply(artboard, 1.0);
  
      instances.rotate.advance(elapsedSeconds);
      instances.rotate.apply(artboard, 1.0);
  
      artboard.advance(elapsedSeconds);
  
      ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
      ctx.save();
      align();
      artboard.draw(renderer);
      ctx?.restore();
      
      requestId = requestAnimationFrame(drawFrame);
    }

    const focus = (e: MouseEvent) => {
      if (!instances) {
        return;
      }
  
      instances.lookY.time = e.clientY / window.innerHeight;
      instances.lookX.time = e.clientX / window.innerWidth;
      instances.lookY.apply(artboard, 1.0);
      instances.lookX.apply(artboard, 1.0);
  
      const d = Math.hypot(
        e.clientX - window.innerWidth / 2, 
        e.clientY - window.innerHeight / 2
      )
  
      const c = Math.hypot(
        window.innerWidth / 2, 
        window.innerHeight / 2
      )
  
      instances.pupil.time = d / c;
      instances.pupil.apply(artboard, 1.0);
    }

    const align = () => {
      renderer.align(
        alignFit.fit,
        alignFit.alignment,
        {
          minX: 0,
          minY: 0,
          maxX: canvas.current?.width ?? 0,
          maxY: canvas.current?.height ?? 0,
        },
        artboard.bounds
      );
    };

    const blink = () => {
      instances.blink.time = 0;
    }

    setCanvas(canvas.current);
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => focus(e));
    canvas.current?.addEventListener('mousedown', blink);
    return () => {
      cancelAnimationFrame(requestId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', (e) => focus(e));
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
      <div ref={container} 
        className='OuterContainer'>
          <div className='InnerContainer'>
            <canvas ref={canvas} />
          </div>
      </div>
      <p>Click the eye</p>
    </div>
  );
}

export default EyeAnimation;
