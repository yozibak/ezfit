import React, { Component } from "react";
import axios from "axios";
import { Col, Container, Row, Form, FormGroup, Label, Input } from "reactstrap";
import {reqhead, token} from "../axiosDefault"
import { WEIGHT_URL } from "../constants";
import CSRFToken from '../constants/GetCookie';
import PropTypes from 'prop-types';

import "react-vis/dist/style.css";
import {XYPlot, XAxis, YAxis, MarkSeries, Hint, LineMarkSeries, makeWidthFlexible,} from 'react-vis';


class Weight extends Component {
    constructor(props){
        super(props);
        this.state = {weights: []}; //default data?
    }

    componentDidMount() {
        this.resetState();
    }

    getWeights = () => {
        axios.get(
            WEIGHT_URL,
            token
        ).then(res => this.setState({ weights: res.data }));
    }

    resetState = () => {
        this.getWeights();
    }

    render(){
        return(
            <Container>
                <Row>
                    <Col>
                        <WeightChart 
                        weights={this.state.weights} 
                        resetState={this.resetState} 
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <WeightInput 
                        resetState={this.resetState}
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
                title="date" />
              <YAxis 
                tickValues={[40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]}
                title="kg" />
              <LineMarkSeries data={data} color="1" />
              <MarkSeries 
              data={axis} 
              style={{ display: 'none' }} />
            </XYPlot>
            
            

Plot.propTypes = { width: PropTypes.number, measurements: PropTypes.array }
Plot.displayName = 'TimeSeriesLineChartPlot'
const FlexibleXYPlot = makeWidthFlexible(Plot)

class WeightChart extends Component {
  render () {
    let weights = this.props.weights;
    const data  = weights.map(weight => (
        {x: weight.date, y: weight.kg}
    ));
    let axis = weights.map(weight => (
        {x: weight.date, y: 55 } //min tick
    )); //default value neededd. if not data, return tutorial.
    return (
      <FlexibleXYPlot data={data} axis={axis}/>
    )
  }
}

/*
class WeightChart extends Component {
    render() {        
        let weights = this.props.weights;
        let data = weights.map(weight => (
            {x: weight.date, y: weight.kg}
        ));
        let axis = weights.map(weight => (
            {x: weight.date, y: 45 } //min tick
        ));
        //const axis = [{x: data[0].date, y: 45},{x: data[0].date, y: 70},];
        const FlexibleXYPlot = makeWidthFlexible(XYPlot); 

        return (
          <div className="App">
            <XYPlot xType="ordinal" height={300} width={1000} >
              <XAxis       
                title="date" />
              <YAxis 
                tickValues={[40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]}
                title="kg" />
              <LineSeries data={data} color="1" />
              <MarkSeries 
              data={axis} 
              style={{ display: 'none' }} />
            </XYPlot>
          </div>
        );
      }
}
*/


class WeightTable extends Component {
    render(){
        const weights = this.props.weights;
        return(
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Weight</th>
                    </tr>
                </thead>
                <tbody>
                    {weights.map(weight => (
                        <tr key = {weight.pk}>
                            <td>{weight.date}</td>
                            <td>{weight.kg}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
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
        axios.post(
            WEIGHT_URL, 
            this.state,
            token
        ).then(() => {
            this.props.resetState();
            this.setState({kg: ""}); //ugly?
        });
    };

    onChange = e => {
        this.setState({kg: e.target.value});
    };

    render(){
        return(
            <Form onSubmit={this.createWeight}>
                <CSRFToken />
                <FormGroup row>
                    <Label for="kg" sm={2}>{new Date().toDateString()}</Label>
                    <Col sm={10}>
                    <Input id="kg" type="number" step='0.1' value={this.state.kg} onChange={this.onChange} placeholder="Weight(kg)"/>
                    </Col>
                </FormGroup>
            </Form>
        );
    }
}

export default Weight;
