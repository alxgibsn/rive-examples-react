import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Menu from './Menu';
import SimpleAnimation from './animations/SimpleAnimation';
import KnightAnimation from './animations/KnightAnimation';
import './App.css';

function App() {
  return (
    <div className='App'>
      <Switch>
        <Route exact path='/' component={Menu} />
        <Route path='/simple' render={(props) => (
          <SimpleAnimation {...props} file='marty.riv' animation='Animation1' />)
        } />
        <Route path='/knight' component={KnightAnimation} />
      </Switch>
    </div>
  );
}

export default App;
