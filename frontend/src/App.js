import React from 'react';
import {Ezfit} from './components/Ezfit';
import {Auth} from './components/Auth';

import './style.css';

function App() {
  return (
    <div className="App">
      <div className="component-left">
        <Auth />
      </div>
      <div className="component-right">
        <Ezfit />
      </div>
    </div>
  );
}

export default App;