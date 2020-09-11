import React, { Component } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import { Col, Container, Row, Form, FormGroup, Button, Input} from "reactstrap";
import {token} from "../axiosDefault"
import { FOOD_URL, TodayString, sampleFoods } from "../constants";
import CSRFToken from '../constants/GetCookie';
import PropTypes from 'prop-types';

import "react-vis/dist/style.css";
import {RadarChart, makeWidthFlexible} from 'react-vis';

class Food extends Component{
    constructor(props){
        super(props);
        this.state = {
            foods: [],
            playmode: false,
            demo:{
                "menu":"",
                "protein":"",
                "fat":"",
                "carbon":"",
                "fiber":"",}
        };
        this.handleDemoChange = this.handleDemoChange.bind(this);
    }

    componentDidMount() {
        this.resetState();
    }

    getFoods = () => {
        axios.get(
            FOOD_URL,
            token
        ).then(res => this.setState({ foods: res.data })
        ).catch(err => {
            this.setState({ playmode: true });
        })
    };

    resetState = () => {
        this.getFoods();
    }

    handleDemoChange(v){
        this.setState({demo: {
            "menu":v.menu,
            "protein":parseInt(v.protein),
            "fat":parseInt(v.fat),
            "carbon":parseInt(v.carbon),
            "fiber":parseInt(v.fiber),
        }});
    }

    render(){
        return(
            <Container style={{ marginTop: "10px" }}>
                <FoodView
                foods={this.state.foods} 
                resetState={this.resetState} 
                playmode={this.state.playmode}
                demo={this.state.demo}
                handleDemoChange={this.handleDemoChange}
                />
            </Container>           
        );
    }
}


class FoodView extends Component{
    render(){
        const foods = this.props.foods;
        let todayFoods =[];
        if (this.props.playmode){
            const d = this.props.demo;
            if (sampleFoods.map(food => food.menu).includes(d.menu)){;
            }else{
                todayFoods = sampleFoods;
                if(d.menu.length>0){
                    todayFoods.push(d);
                }
            }
        }else{
            todayFoods = foods.filter(food => food.date === TodayString);
        }
        
        let p=0,f=0,c=0,fib=0;
        if(todayFoods.length>0){
            const reducer = (acc, cur) => acc + cur;
            p = todayFoods.map(food => food.protein).reduce(reducer);
            f = todayFoods.map(food => food.fat).reduce(reducer);
            c = todayFoods.map(food => food.carbon).reduce(reducer);
            fib = todayFoods.map(food => food.fiber).reduce(reducer);
        }
        const todaySum = { P: p, F:f, C:c, Fib: fib };
        const cal = p*4 + f*9 + c*4 ;
        return(
            <div>
            <Row>
                <Col sm={8}>
                <FoodGraph data={todaySum}/>
                </Col>
                <Col sm={4}>
                    <FoodPanel todayFoods={todayFoods} cal={cal} todaySum={todaySum} />
                </Col>
            </Row>
                <FoodInput 
                    resetState={this.props.resetState} 
                    foods={foods}
                    playmode={this.props.playmode}
                    handleDemoChange={this.props.handleDemoChange}
                    />
            </div>
        );
    }
}


const FoodPanel = (props) => {  
    const cal = props.cal;
    const foods = props.todayFoods;
    const data = props.todaySum;
    const todaySum = () => {
        if (data ==={}){
            return null;
        }else{
            let n =`P:${data.P}, F:${data.F}, C:${data.C}, Fib:${data.Fib} \n\n`;
            let f = foods.map(food => food.menu).join('\n')
            return n+f;
        }
    };
    return (
        <div style={{textAlign:"center", padding: "6px"}}>
            <legend id='nttip'><em>{cal} </em>kcal today.</legend>
            <div style={{ whiteSpace: "pre-line"}}>{todaySum()}</div>
        </div>
    );
}


class FoodInput extends Component{
    constructor(props){
        super(props);
        this.state = {
            "pk": "",
            "menu": "",
            "protein": "",
            "fat": "",
            "carbon": "",
            "fiber": "",
            "user": 1
        };
        this.createFood = this.createFood.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    // 
    createFood = e => {
        e.preventDefault();
        if (this.props.playmode) {
            let v=this.state
            this.props.handleDemoChange(v);
            this.setState({
                "menu": "",
                "protein": "",
                "fat": "",
                "carbon": "",
                "fiber": "",
            });
            window.alert("Please sign up or Log In.")
        }else{
            axios.post(
                FOOD_URL, 
                this.state,
                token
            ).then(() => {
                this.props.resetState();
                this.setState({
                    "menu": "",
                    "protein": "",
                    "fat": "",
                    "carbon": "",
                    "fiber": "",
                });
            });
        }
    };

    checkPastFood = (e) => {
        if (this.props.playmode === false){
            this.props.foods.forEach(food =>{
                if(food.menu === e.target.value){
                    this.setState({
                        "menu": food.menu,
                        "protein": food.protein,
                        "fat": food.fat,
                        "carbon": food.carbon,
                        "fiber": food.fiber
                    });
                }
            })
        }
        this.onChange(e);
    };

    onChange = e => {
        this.setState({
            [e.target.id]: e.target.value
          });
    };

    render(){
        return(
            <Form onSubmit={this.createFood}>
                <CSRFToken />
                    <FormGroup>
                        <Col>
                        <Input bsSize="sm" id="menu" type="text" value={this.state.menu} onChange={this.checkPastFood} placeholder="Menu" />
                        </Col>
                        <Col>
                        <Input bsSize="sm" id="protein" type="number" step="0.1" value={this.state.protein} onChange={this.onChange} placeholder="Protein" />
                        </Col>
                        <Col>
                        <Input bsSize="sm" id="fat" type="number" step="0.1" value={this.state.fat} onChange={this.onChange} placeholder="Fat" />
                        </Col>
                        <Col>
                        <Input bsSize="sm" id="carbon" type="number" step="0.1" value={this.state.carbon} onChange={this.onChange} placeholder="Carbon" />
                        </Col>
                        <Col>
                        <Input bsSize="sm" id="fiber" type="number" step="0.1" value={this.state.fiber} onChange={this.onChange} placeholder="Fiber" />
                        
                        </Col>
                        <Col>
                        <Button size="sm" type="submit" block>Eat</Button>
                        </Col>
                    </FormGroup>
            </Form>
        );
    }
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

class FoodGraph extends Component{

    render(){
        const RADAR_PROPS={
            data: [this.props.data],
            domains: [
              {name: 'P', domain: [0, 180]}, 
              {name: 'F', domain: [0, 150]}, 
              {name: 'C', domain: [0, 300]}, 
              {name: 'Fib', domain: [0, 45]}  
            ],
          };
        return(
            <FlexibleRadar 
            data={RADAR_PROPS.data}
            domains={RADAR_PROPS.domains}
            />
        )
    }
}

export default Food;