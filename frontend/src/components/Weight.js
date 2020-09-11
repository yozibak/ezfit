import React, { Component } from "react";
import axios from "axios";
import { Col, Container, Row, Form, FormGroup, Label, Input } from "reactstrap";
import {token} from "../axiosDefault"
import { WEIGHT_URL, TodayString, generateSample } from "../constants";
import CSRFToken from '../constants/GetCookie';
import PropTypes from 'prop-types';

import "react-vis/dist/style.css";
import {XYPlot, XAxis, YAxis, MarkSeries, LineMarkSeries, makeWidthFlexible,} from 'react-vis';


class Weight extends Component {
    constructor(props){
        super(props);
        this.state = {
            weights: [],
            playmode: false,
            demo: {}
        }; 
        this.handleDemoChange = this.handleDemoChange.bind(this);
    }

    componentDidMount() {
        this.resetState();
    }

    getWeights = () => {
        axios.get(
            WEIGHT_URL,
            token
        ).then(res => this.setState({ weights: res.data })
        ).catch(err => {
            this.setState({ playmode: true });
        })
    };

    resetState = () => {
        this.getWeights();
    }

    handleDemoChange(value){
        this.setState({demo: {x:TodayString, y:value}});
    }

    render(){
        return(
            <Container style={{ marginTop: "10px" }}>
                <Row>
                    <Col>
                        <WeightChart 
                        weights={this.state.weights} 
                        resetState={this.resetState} 
                        playmode={this.state.playmode} 
                        demo={this.state.demo}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <WeightInput 
                        resetState={this.resetState}
                        playmode={this.state.playmode}
                        handleDemoChange={this.handleDemoChange}
                        />
                    </Col>
                </Row>
            </Container>           
        );
    }
}

const Plot = ({ width, data, axis})  => 
    <XYPlot xType="ordinal" height={250} width={width} >
              <XAxis       
                title="date" 
                tickValues = {[]}
                />
              <YAxis 
                tickValues={[40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]}
                title="kg" />
              <LineMarkSeries data={data} color="1" />
              <MarkSeries 
              data={axis} 
              style={{ display: 'none' }} />
            </XYPlot>
            
            

Plot.propTypes = { width: PropTypes.number, measurements: PropTypes.array }
Plot.displayName = 'RADAR'
const FlexibleXYPlot = makeWidthFlexible(Plot)

class WeightChart extends Component {
  render () {
    let weights = this.props.weights;
    let data = [];
    if (this.props.playmode) {
        let d = this.props.demo;
        data = generateSample();
        if( Object.keys(d).length >0 ){
            data.push(d);
        }
    }else{data = weights.map(weight => (
        {x: weight.date, y: weight.kg}
    ));
    }
    let axis = [
        {x: TodayString, y: 55 },
        {x: TodayString, y: 70 },
    ]
    return (
      <FlexibleXYPlot data={data} axis={axis}/>
    )
  }
}


class WeightInput extends Component{
    constructor(props){
        super(props);
        this.state = {
            "pk": "",
            "date": "",
            "kg": "",
            "user": 1
        };
        this.createWeight = this.createWeight.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    createWeight = e => {
        e.preventDefault();
        if (this.props.playmode) {
            let v=this.state.kg;
            this.props.handleDemoChange(v);
            this.setState({kg: ""});
        }else{
            axios.post(
                WEIGHT_URL, 
                this.state,
                token
            ).then(() => {
                this.props.resetState();
                this.setState({kg: ""}); 
            });
        }
    };

    onChange = e => {
        this.setState({kg: e.target.value});
    };

    render(){
        return(
            <Form onSubmit={this.createWeight}>
                <CSRFToken />
                <FormGroup row>
                    <Label for="kg" sm={3} style={{textAlign: 'center'}}>{new Date().toDateString()}</Label>
                    <Col sm={9}>
                    <Input id="kg" type="number" step='0.1' value={this.state.kg} onChange={this.onChange} placeholder="Weight(kg)"/>
                    </Col>
                </FormGroup>
            </Form>
        );
    }
}

export default Weight;
