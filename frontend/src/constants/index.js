// API (switch when deploying)
//export const API_URL = "http://localhost:8000/api/"
export const API_URL = "http://www.ezfit.xyz/api/"

export const WEIGHT_URL = new URL('weight/', API_URL)
export const FOOD_URL = new URL('food/', API_URL)

export const AUTH_URL = new URL('auth/user', API_URL)
export const LOGIN_URL = new URL('auth/login', API_URL)
export const SIGNUP_URL = new URL('auth/signup', API_URL)

const Today = new Date();
export const TodayString = Today.getFullYear() + '-' + ('0' + (Today.getMonth() + 1)).slice(-2) + '-' + ('0' + Today.getDate()).slice(-2);