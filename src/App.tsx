import { Route, Switch } from 'react-router-dom';
import Menu from './Menu';
import MartyAnimation from './animations/MartyAnimation';
import KnightAnimation from './animations/KnightAnimation';
import EyeAnimation from './animations/EyeAnimation';
import './App.css';

const App = () => {
  return (
    <div className='App'>
      <Switch>
        <Route exact path='/' component={Menu} />
        <Route path='/marty' component={MartyAnimation} />
        <Route path='/knight' component={KnightAnimation} />
        <Route path='/eye' component={EyeAnimation} />
      </Switch>
    </div>
  );
}

export default App;
