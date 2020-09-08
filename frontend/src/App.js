import React, { Fragment } from 'react';
import { Col, Container, Row } from "reactstrap";
import './App.css';

import Auth from './account/Auth';
import Weight from  './components/Weight';

function App() {
  return (
    <Fragment>
      <Auth />
      <Weight />
    </Fragment>
  );
}

export default App;
