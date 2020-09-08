import React from 'react';
import { Col, Container, Row, Form, FormGroup, Label, Input } from "reactstrap";
import PropTypes from 'prop-types';

export class LoginForm extends React.Component {
    state = {
      username: '',
      password: ''
    };
  
    handle_change = e => {
      const name = e.target.name;
      const value = e.target.value;
      this.setState(prevstate => {
        const newState = { ...prevstate };
        newState[name] = value;
        return newState;
      });
    };
  
    render() {
      return (
          
        <Form onSubmit={e => this.props.handle_login(e, this.state)}>
            
            <FormGroup>
            
          <Col>
          <Label>Log In</Label>
          <Input
            type="text"
            name="username"
            placeholder="username"
            value={this.state.username}
            onChange={this.handle_change}
          />
          </Col>
          </FormGroup>
          <FormGroup>
          <Col>
          <Input
            type="password"
            name="password"
            placeholder="password"
            value={this.state.password}
            onChange={this.handle_change}
          />
          </Col>
          </FormGroup>
          <FormGroup>
          <Col>
          <Input type="submit" />
          </Col>
          </FormGroup>
        </Form>
      );
    }
  }

export class SignupForm extends React.Component {
    state = {
        username: '',
        email: '',
        password: ''
    };

    handle_change = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevstate => {
        const newState = { ...prevstate };
        newState[name] = value;
        return newState;
        });
    };

    render() {
        return (
            <Form onSubmit={e => this.props.handle_signup(e, this.state)}>
            
            <FormGroup>  
          <Col>
          <Label>Signup</Label>
          <Input
            type="text"
            name="username"
            placeholder="username"
            value={this.state.username}
            onChange={this.handle_change}
          />
          </Col>
          </FormGroup>
          <FormGroup>
          <Col>
          <Input
            type="email"
            name="email"
            placeholder="email"
            value={this.state.email}
            onChange={this.handle_change}
          />
          </Col>
          </FormGroup>       
          <FormGroup>
          <Col>
          <Input
            type="password"
            name="password"
            placeholder="password"
            value={this.state.password}
            onChange={this.handle_change}
          />
          </Col>
          </FormGroup>
          <FormGroup>
          <Col>
          <Input type="submit" />
          </Col>
          </FormGroup>
        </Form>
        );
    }
}

SignupForm.propTypes = {
    handle_signup: PropTypes.func.isRequired
};