import React, { useState, useEffect} from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import { Col, Container, Row, Form, FormGroup, Button, Input} from "reactstrap";
import {token} from "../constants/axiosDefault"
import { FOOD_URL, TodayString } from "../constants";

import PropTypes from 'prop-types';

import "react-vis/dist/style.css";
import {RadarChart, makeWidthFlexible} from 'react-vis';


export const Food = () => {
    const [foods, setFoods] = useState([])

    useEffect(() => {getFoods()}, [])

    const getFoods = () =>{
        axios.get(FOOD_URL, token())
        .then(res => {
            setFoods(res.data)
            console.log('getfoods()', foods)
        })
    }

    return (
        <Container style={{ marginTop: "10px" }}>
            <FoodView foods={foods} />
            <FoodInput getFoods={getFoods} foods={foods} />
        </Container>  
    )
}


const FoodView = ({foods}) => {
    let todayFoods
    let p=0,f=0,c=0,fib=0
    console.log(foods.length)
    if(foods.length > 0){
        todayFoods = foods.filter(food => food.date === TodayString)
        const reducer = (acc, cur) => acc + cur
        p = todayFoods.map(food => food.protein).reduce(reducer)
        f = todayFoods.map(food => food.fat).reduce(reducer)
        c = todayFoods.map(food => food.carbon).reduce(reducer)
        fib = todayFoods.map(food => food.fiber).reduce(reducer)    
        console.log('daaaaaaaaaaaaa')
    }
    let todaySum = { P: p, F:f, C:c, Fib: fib }
    let cal = p*4 + f*9 + c*4
    return (
        <Row>
            <Col sm={8}>
                <FoodGraph data={todaySum}/>
            </Col>
            <Col sm={4}>
                <FoodPanel todayFoods={todayFoods} cal={cal} todaySum={todaySum} />
            </Col>
        </Row>
    )
}


const FoodGraph = ({data}) => {
    console.log(data)
    const RADAR_PROPS={
        data: [data],
        domains: [
          {name: 'P', domain: [0, 180]}, 
          {name: 'F', domain: [0, 150]}, 
          {name: 'C', domain: [0, 300]}, 
          {name: 'Fib', domain: [0, 45]}  
        ]
      }
    console.log(RADAR_PROPS)
    return(
        <FlexibleRadar 
        data={RADAR_PROPS.data}
        domains={RADAR_PROPS.domains}
        />
    )
}

const Radar = ({width, data, domains}) => 
    <RadarChart
        data={data}
        domains={domains}
        width={width/1.2}
        height={width/1.3}
        startingAngle={45}
        style={{
          polygons: {
            fillOpacity: 0.8,
            fill: '#000000',
            strokeOpacity: 1,
            strokeWidth: 3,
            stroke: '#000000'
          }
        }}
      />

Radar.propTypes = { width: PropTypes.number, measurements: PropTypes.array }
const FlexibleRadar = makeWidthFlexible(Radar)


const FoodPanel = (props) => {  
    const cal = props.cal
    const foods = props.todayFoods
    const data = props.todaySum

    const todaySum = () => {
        if(foods){
            console.log(data)
            let n =`P:${data.P}, F:${data.F}, C:${data.C}, Fib:${data.Fib} \n\n`;
            let f = foods.map(food => food.menu).join('\n')
            return n+f;
        }else{
            return null;            
        }
    }
    return (
        <div style={{textAlign:"center", padding: "6px"}}>
            <legend id='nttip'><em>{cal} </em>kcal today.</legend>
            <div style={{ whiteSpace: "pre-line"}}>{todaySum()}</div>
        </div>
    )
}


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
        <Form onSubmit={submitFood}>
            <FormGroup>
                <Col>
                    <Input bsSize="sm" id="menu" type="text" value={food.menu} onChange={checkPastFood} placeholder="Menu" />
                </Col>
                <Col>
                    <Input bsSize="sm" id="protein" type="number" step="0.1" value={food.protein} onChange={onChange} placeholder="Protein" />
                </Col>
                <Col>
                    <Input bsSize="sm" id="fat" type="number" step="0.1" value={food.fat} onChange={onChange} placeholder="Fat" />
                </Col>
                <Col>
                    <Input bsSize="sm" id="carbon" type="number" step="0.1" value={food.carbon} onChange={onChange} placeholder="Carbon" />
                </Col>
                <Col>
                    <Input bsSize="sm" id="fiber" type="number" step="0.1" value={food.fiber} onChange={onChange} placeholder="Fiber" />
                </Col>
                <Col>
                    <Button size="sm" type="submit" block>Eat</Button>
                </Col>
            </FormGroup>
        </Form>
    )
}