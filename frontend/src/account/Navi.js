import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

function Navi(props) {
  const logged_out_nav = (
    <div>
      <Button color="link" onClick={() => props.display_form('login')}>login</Button>
      <Button color="link" onClick={() => props.display_form('signup')}>signup</Button>
    </div>
      
  );

  const logged_in_nav = (
    <div>
      <Button color="link" onClick={props.handle_logout}>logout</Button>
    </div>
  );
  return <div>{props.logged_in ? logged_in_nav : logged_out_nav}</div>;
}

export default Navi;

Navi.propTypes = {
  logged_in: PropTypes.bool.isRequired,
  display_form: PropTypes.func.isRequired,
  handle_logout: PropTypes.func.isRequired
};