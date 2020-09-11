import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';

function Navi(props) {
  const logged_out_nav = (
    <Row>
      <div class="btn" role="button" onClick={() => props.display_form('login')}>login</div>
      <div class="btn" role="button" onClick={() => props.display_form('signup')}>signup</div>
    </Row>
  );

  const logged_in_nav = (
    <div>
      <div class="btn" role="button" onClick={props.handle_logout}>logout</div>
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