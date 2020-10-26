import React, { Fragment } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

import './App.css';

import {Auth} from './components/Auth';
import {Weight} from  './components/Weight';
import {Food} from  './components/Food';


function App() {
  return (
    <Fragment>
      <Auth />
      <Weight />
      <Food />
    </Fragment>
  );
}

export default App;
