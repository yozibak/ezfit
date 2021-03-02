// API (switch when deploying)
export const API_URL = "http://localhost:8000/api/"
// export const API_URL = "http://www.ezfit.xyz/api/"

export const WEIGHT_URL = new URL('weight/', API_URL)
export const FOOD_URL = new URL('food/', API_URL)

export const AUTH_URL = new URL('auth/user', API_URL)
export const LOGIN_URL = new URL('auth/login', API_URL)
export const SIGNUP_URL = new URL('auth/signup', API_URL)

export const WeekStrings = []
const Day = new Date()
Day.setDate(Day.getDate() + 1)
for(let i = 0; i <7; i++) {
    Day.setDate(Day.getDate() - 1)
    const DayString = Day.getFullYear() + '-' + ('0' + (Day.getMonth() + 1)).slice(-2) + '-' + ('0' + Day.getDate()).slice(-2)
    WeekStrings.push(DayString)
}