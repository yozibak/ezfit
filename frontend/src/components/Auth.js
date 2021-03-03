import React, { useState, useEffect } from "react"
import axios from "axios"
import {reqhead, token} from "../constants/axiosDefault"
import { LOGIN_URL, SIGNUP_URL, AUTH_URL } from "../constants"

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
        axios.post(api, JSON.stringify(data), reqhead)
        .then(res =>{
            localStorage.setItem('token', res.data.token)
            setLoggedIn(true)
            setUsername(res.data.user.username)
            setDisplay('')
            window.location.reload()
        })
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        setLoggedIn(false)
        setUsername('')
        window.location.reload()
    }

    return (
        <div>
            <legend style={{margin: "14px 0"}}>EZFIT</legend>
            <p>{logged_in ? ` @${username}` : ''}</p>
            <LoginSignupForm display={display} handler={handleLoginSignup} />
            <Navi
                logged_in={logged_in}
                setDisplay={setDisplay}
                handleLogout={handleLogout}
                />
        </div>           
    )
}


const Navi = props => {

    const navClick = (mode) => {
        props.setDisplay(mode)
        document.getElementById("logged-out-nav").style.display = "none"
    }

    const logged_out_nav = (
        <div id="logged-out-nav">
          <div className="btn" role="button" onClick={() => navClick('login')}>login</div>
          <div className="btn" role="button" onClick={() => navClick('signup')}>signup</div>
        </div>
      )
    
      const logged_in_nav = (
        <div id="logged-in-nav">
          <div className="btn" role="button" onClick={props.handleLogout}>logout</div>
        </div>
      )
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
    }
    
    const submitForm = e => {
        if (display ==='login'){
            handler(e, {username: formValue.username, password: formValue.password}, LOGIN_URL)
        }else if(display ==='signup'){
            handler(e, formValue, SIGNUP_URL)
        }
    }
    
    if(display==='login'){
        return(            
            <form onSubmit={e => submitForm(e)}>
                <input type="text" name="username" placeholder="username" value={formValue.username} onChange={handleChange}/>
                <input type="text" name="password" placeholder="password" value={formValue.password} onChange={handleChange}/>
                <button type="submit">submit</button>
            </form>
        )
    }else if(display==='signup'){
        return(
            <form onsubmit={e => submitForm(e)}>
                <input type="text" name="username" placeholder="username" value={formValue.username} onChange={handleChange}/>
                <input type="text" name="email" placeholder="email" value={formValue.email} onChange={handleChange} />
                <input type="text" name="password" placeholder="password" value={formValue.password} onChange={handleChange}/>
                <input type="submit" />
            </form>
        )
    }else{
        return null
    }
}