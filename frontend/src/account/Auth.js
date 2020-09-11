import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import axios from "axios";
import Navi from './Navi';
import {reqhead, token} from "../axiosDefault"
import { API_URL } from "../constants";
import {LoginForm, SignupForm}　from './Forms';

class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = {
          displayed_form: '',
          logged_in: token ? true : false,
          username: ''
        };
    }

    componentDidMount(){
        if(this.state.logged_in){
            const url = new URL('auth/user', API_URL);
            axios.get(url,token
            ).then(res => {this.setState({username: res.data.username})}
            ).catch(err => {this.setState({username: '', logged_in: false})}) //catch unauthorized token
        }else{this.setState({logged_in: false})}
    }
    
    handle_login = (e, data) => {
        e.preventDefault();
        const url = new URL('auth/login', API_URL);
        axios.post(
            url,
            JSON.stringify(data),
            reqhead
        ).then(res => {
            localStorage.setItem('token', res.data.token);
            this.setState({
                logged_in: true,
                displayed_form: '',
                username: res.data.user.username
            });
            window.location.reload();
        });
    };

    handle_signup = (e, data) => {
        e.preventDefault();
        const url = new URL('auth/signup', API_URL);
        axios.post(
            url,
            JSON.stringify(data),
            reqhead
        ).then(res => {
            localStorage.setItem('token', res.data.token);
            // no need
            this.setState({
                logged_in: true,
                displayed_form: '',
                username: res.data.user.username
            });
            window.location.reload();
        });
    };

    handle_logout = () => {
        localStorage.removeItem("token");
        this.setState({ logged_in: false, username: '' });
        window.location.reload();
    };

    display_form = form => {
        this.setState({
            displayed_form: form
        });
    };

    render(){
        let form;
        switch (this.state.displayed_form) {
          case 'login':
            form = <LoginForm handle_login={this.handle_login} />;
            break;
          case 'signup':
            form = <SignupForm handle_signup={this.handle_signup} />;
            break;
          default:
            form = null;
        }

        return(
            <Container style={{ marginTop: "20px" }}>
                <Row>
                    <Col　xs="3">
                    <legend>EZFIT</legend>
                    <p>{this.state.logged_in ? ` @${this.state.username}` : ''}</p>
                    </Col>
                    <Col>
                    {form}
                    </Col>
                    <Col　xs="3">
                    <Navi
                        logged_in={this.state.logged_in}
                        display_form={this.display_form}
                        handle_logout={this.handle_logout}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Auth;