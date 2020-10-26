import React, { useState, useEffect } from "react"
import axios from "axios"
import {reqhead, token} from "../constants/axiosDefault"
import { LOGIN_URL, SIGNUP_URL, AUTH_URL } from "../constants"
import { Container, Col, Row, Form, FormGroup, Label, Input } from "reactstrap";

export const Auth = () => {
    const [display, setDisplay ] = useState('') // switch form
    const [logged_in, setLoggedIn ] = useState(token() ? true : false)
    const [username, setUsername] = useState('')

    useEffect(() =>{
        if(logged_in){
            axios.get(AUTH_URL,token()).then(res =>{setUsername(res.data.username)})
        }
    },[])

    const handleLoginSignup = (e, data, api) => {
        e.preventDefault()
        console.log(data)
        axios.post(api, JSON.stringify(data), reqhead)
        .then(res =>{
            localStorage.setItem('token', res.data.token)
            setLoggedIn(true)
            setUsername(res.data.user.username) //?
            setDisplay('')
        })
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        setLoggedIn(false)
        setUsername('')
        window.location.reload()
    }

    return (
        <Container style={{ marginTop: "20px" }}>
            <Row>
                <Col　xs="3">
                <legend>EZFIT</legend>
                <p>{logged_in ? ` @${username}` : ''}</p>
                </Col>
                <Col>
                    <LoginSignupForm display={display} handler={handleLoginSignup} />
                </Col>
                <Col　xs="3">
                <Navi
                    logged_in={logged_in}
                    setDisplay={setDisplay}
                    handleLogout={handleLogout}
                    />
                </Col>
            </Row>
        </Container>   
    )
}


const Navi = props => {
    const logged_out_nav = (
        <Row>
          <div class="btn" role="button" onClick={() => props.setDisplay('login')}>login</div>
          <div class="btn" role="button" onClick={() => props.setDisplay('signup')}>signup</div>
        </Row>
      );
    
      const logged_in_nav = (
        <div>
          <div class="btn" role="button" onClick={props.handleLogout}>logout</div>
        </div>
      );
      return <div>{props.logged_in ? logged_in_nav : logged_out_nav}</div>;   
}


const LoginSignupForm = ({display, handler}) => {
    const [formValue, setFormValue] = useState({
            username: '',
            email: '',
            password: ''
        })
    
    const handleChange = e => {
        let name = e.target.name
        let value = e.target.value
        setFormValue(() => {
            const newFormValue = {...formValue}
            newFormValue[name] = value
            return newFormValue
        }
        )
        console.log(formValue)
    }
    
    const submitForm = e => {
        console.log(formValue)
        if (display ==='login'){
            handler(e, {username: formValue.username, password: formValue.password}, LOGIN_URL)
        }else if(display ==='signup'){
            handler(e, formValue, SIGNUP_URL)
        }
    }
    
    if(display==='login'){
        return(
            <Form onSubmit={e => submitForm(e)}>
              <FormGroup>
              <Col>
              <Label>Log In</Label>
              <Input
                type="text"
                name="username"
                placeholder="username"
                value={formValue.username}
                onChange={handleChange}
              />
              </Col>
              </FormGroup>
              <FormGroup>
              <Col>
              <Input
                type="password"
                name="password"
                placeholder="password"
                value={formValue.password}
                onChange={handleChange}
              />
              </Col>
              </FormGroup>
              <FormGroup>
              <Col>
              <Input type="submit" />
              </Col>
              </FormGroup>
            </Form>
        )
    }else if(display==='signup'){
        return(
            <Form onSubmit={e => submitForm(e)}>
              <FormGroup>
              <Col>
              <Label>Signup</Label>
              <Input
                type="text"
                name="username"
                placeholder="username"
                value={formValue.username}
                onChange={handleChange}
              />
              </Col>
              </FormGroup>
              <FormGroup>
              <Col>
              <Input
                type="text"
                name="email"
                placeholder="email"
                value={formValue.email}
                onChange={handleChange}
              />
              </Col>
              </FormGroup>
              <FormGroup>
              <Col>
              <Input
                type="password"
                name="password"
                placeholder="password"
                value={formValue.password}
                onChange={handleChange}
              />
              </Col>
              </FormGroup>
              <FormGroup>
              <Col>
              <Input type="submit" />
              </Col>
              </FormGroup>
            </Form>
        )
    }else{
        return null
    }
}