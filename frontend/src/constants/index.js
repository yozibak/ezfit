// switch when deploying
export const API_URL = "http://localhost:8000/api/"
//export const API_URL = "http://www.ezfit.xyz/api/"

export const WEIGHT_URL = new URL('weight/', API_URL)
export const FOOD_URL = new URL('food/', API_URL)

export const AUTH_URL = new URL('auth/user', API_URL)
export const LOGIN_URL = new URL('auth/login', API_URL)
export const SIGNUP_URL = new URL('auth/signup', API_URL)

const Today = new Date();
export const TodayString = Today.getFullYear() + '-' + ('0' + (Today.getMonth() + 1)).slice(-2) + '-' + ('0' + Today.getDate()).slice(-2);


export function generateSample(){
    let days =[];
    let date = new Date();
    for (let i = 0; i <7; ++i){
        let d = date.setDate(date.getDate() -1);
        days.unshift(d);
    }
    let weights = [60, 57.5, 60.2, 60, 61.3, 60.8, 61];
    let data = [];
    for (let i = 0; i <7; ++i){
        let p = new Date(days[i]);
        let append =　{x:p.toISOString().slice(0,10), y:weights[i]}
        data.push(append);
    }
    return data;
}

export const sampleFoods = [
    {
        "menu":"bread",
        "protein":8,
        "fat":2,
        "carbon":28,
        "fiber":4,
    },
    {
        "menu":"chiken,200g",
        "protein":39,
        "fat":23,
        "carbon":0,
        "fiber":0,
    },
    {
        "menu":"sandwiches",
        "protein":18,
        "fat":21,
        "carbon":20,
        "fiber":3,
    },
];