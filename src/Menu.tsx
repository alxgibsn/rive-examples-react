import { Link } from 'react-router-dom';

export default function Menu() {
  return (
    <div className='Menu'>
      <img className='Rive' alt='Rive'
          src="https://cdn.2dimensions.com/icons/rive_logo_white.svg" />
      <Link className='ExampleLink' to='/marty'>Marty</Link>
      <Link className='ExampleLink' to='/knight'>Knight</Link>
      <Link className='ExampleLink' to='/eye'>Eye</Link>
    </div>
  );
}