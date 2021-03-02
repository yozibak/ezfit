import React, { useState, useEffect} from "react";
import axios from "axios";

import {token} from "../constants/axiosDefault"
import { FOOD_URL, WeekStrings } from "../constants";

import PropTypes from 'prop-types';

import "react-vis/dist/style.css";
import {XYPlot, XAxis, YAxis, LineMarkSeries, Crosshair, VerticalBarSeries, makeWidthFlexible, DiscreteColorLegend } from 'react-vis';


export const Food = () => {
    const [foods, setFoods] = useState([])

    useEffect(() => {getFoods()}, [])

    const getFoods = () =>{
        axios.get(FOOD_URL, token())
        .then(res => {
            setFoods(res.data)
        })
    }

    return (
        <div>
            <FoodView foods={foods} />
            <FoodInput getFoods={getFoods} foods={foods} />
            <FoodTable foods={foods} /> 
        </div>  
    )
}

const FoodTable = ({foods}) => {
    const [tableSwitch, setSwitch] = useState(false)

    const toggle = () => {
        setSwitch(!tableSwitch)
    }

    if(tableSwitch){
        let foodtable = foods.map(
            food => {
                let cal = food.protein*4 + food.fat*9 + food.carbon*4
                return <tr><td>{food.date}</td><td>{food.menu}</td><td>{food.protein}</td><td>{food.fat}</td><td>{food.carbon}</td><td>{food.fiber}</td><td>{cal}</td></tr>}
            )
        return (
            <div>
                <div>
                    <table>
                        <tr><th>date</th><th>menu</th><th>protein</th><th>fat</th><th>carbon</th><th>fiber</th><th>Calorie</th></tr>
                        {foodtable}
                    </table>
                </div>
                <div onClick={toggle}>close logs</div>
            </div>
        )
    }else{
        return <div onClick={toggle}>show logs</div>
    }
}


const FoodView = ({foods}) => {
    let weeklyNtr = []
    let renderFlag = false
    WeekStrings.forEach(DateString => {
        let dayFoods
        let p=0,f=0,c=0,fib=0
        if(foods.length > 0){
            renderFlag = true
            dayFoods = foods.filter(food => food.date === DateString)
            const reducer = (acc, cur) => acc + cur
            p = dayFoods.map(food => food.protein).reduce(reducer,0)
            f = dayFoods.map(food => food.fat).reduce(reducer,0)
            c = dayFoods.map(food => food.carbon).reduce(reducer,0)
            fib = dayFoods.map(food => food.fiber).reduce(reducer,0)    
        }
        let cal = p*4 + f*9 + c*4
        let daySum = { date: DateString, P: p, F:f, C:c, Fib: fib , Cal:cal}
        weeklyNtr.unshift(daySum)
        }
    )

    console.log(weeklyNtr)
    if(renderFlag){
        return (
            <div>
                <FoodGraph weeklyData={weeklyNtr} />
            </div>
        )
    }else{
        return <div>loading</div>
    }
}


const FoodGraph = ({weeklyData}) => {
    const [crosshair, setCrosshair] = useState([])

    let Pseries = weeklyData.map(d => ({x: d.date, y: 4*d.P}))
    let Fseries = weeklyData.map(d => ({x: d.date, y: 9*d.F}))
    let Cseries = weeklyData.map(d => ({x: d.date, y: 4*d.C}))
    let Fibseries = weeklyData.map(d => ({x: d.date, y: 10*d.Fib}))
    let Calseries = weeklyData.map(d => ({x: d.date, y: d.Cal}))

    const titles = ['calories', 'protein', 'fat', 'carbon', 'fiber']
    const colorRange=["#1A3177", "#EF5D28", "#FF9832", "#79C8E3", "#12939A"]

    
    const ITEMS = [0,1,2,3,4].map(i => ({title: titles[i], color: colorRange[i]}))

    return (<div className="horizontal">
            <FlexibleXYPlot p={Pseries} f={Fseries} c={Cseries} fib={Fibseries} cal={Calseries} crosshair={crosshair} set={setCrosshair} colors={colorRange}/>
            <DiscreteColorLegend style={{margin: "auto"}} items={ITEMS} />
        </div>
    )
}

const Plot = ({width, p, f, c, fib, cal, crosshair, set, colors}) => 
    <XYPlot 
        onMouseLeave={() => set([])}
        width={width} height={500} xType="ordinal"
        margin={{left: 50}}
        >
        <XAxis tick={[]}/>
        <YAxis title="kcal"/>
        <VerticalBarSeries 
            data={cal}
            onNearestX = {(value, {index}) => {
                let newHair = [p[index], f[index], c[index], fib[index], cal[index]]
                set(newHair)
            }}
            color={colors[0]}
            opacity={0.9}
            />
        <LineMarkSeries data={fib} color={colors[1]}/>
        <LineMarkSeries data={c} color={colors[2]}/>
        <LineMarkSeries data={p} color={colors[3]}/>
        <LineMarkSeries data={f} color={colors[4]}/>
        <Crosshair 
            values = {crosshair}
            titleFormat = {(d) => ({title: d[0].x, value: d[4].y + 'Kcal'})}
            itemsFormat = {(d) => ([
                    {title: 'Protein', value: d[0].y/4},{title: 'Fat', value: d[1].y/9}, {title: 'Carbon', value: d[2].y/4}, 
                    {title: 'Fiber', value: d[3].y/10}
                ])}
        />
    </XYPlot>


Plot.propTypes = { width: PropTypes.number, measurements: PropTypes.array }
Plot.displayName = 'NtrChart'
const FlexibleXYPlot = makeWidthFlexible(Plot)



const FoodInput = ({getFoods, foods}) => {
    const initialState = {
        "menu": "",
        "protein": "",
        "fat": "",
        "carbon": "",
        "fiber": ""
    }
    const [food, setFood] = useState(initialState)

    useEffect(() => {}, [food])


    const submitFood = e => {
        e.preventDefault()
        axios.post(FOOD_URL, food, token())
        .then(() => {
            getFoods()
            setFood(initialState)
        })
    }

    const checkPastFood = e => {
        let match = foods.find(food => food.menu === e.target.value)
        if(match){
            setFood({
                "menu": match.menu,
                "protein": match.protein,
                "fat": match.fat,
                "carbon": match.carbon,
                "fiber": match.fiber
            })
        }else{
            onChange(e)
        }
    }

    const onChange = e => {
        let newFood = {...food}
        newFood[e.target.id] = e.target.value
        setFood(newFood)
    }

    return(
        <form onSubmit={submitFood}>
            <div>
                <input id="menu" type="text" value={food.menu} onChange={checkPastFood} placeholder="Menu" />
                <input id="protein" type="number" step="0.1" value={food.protein} onChange={onChange} placeholder="Protein" />    
                <input id="fat" type="number" step="0.1" value={food.fat} onChange={onChange} placeholder="Fat" />
                <input id="carbon" type="number" step="0.1" value={food.carbon} onChange={onChange} placeholder="Carbon" />
                <input id="fiber" type="number" step="0.1" value={food.fiber} onChange={onChange} placeholder="Fiber" />    
                <button type="submit" block>Eat!</button>
            </div>
        </form>
    )
}