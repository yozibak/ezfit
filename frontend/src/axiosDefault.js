import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
export const reqhead = {headers: {'Content-Type': 'application/json'}};
export const token = {headers: {Authorization: `Token ${localStorage.getItem('token')}`}};