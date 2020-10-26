import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import { Col, Container, Row, Form, FormGroup, Label, Input } from "reactstrap";
import {token} from "../constants/axiosDefault"
import { WEIGHT_URL, TodayString, generateSample } from "../constants";
import PropTypes from 'prop-types';

import "react-vis/dist/style.css";
import {XYPlot, XAxis, YAxis, MarkSeries, LineMarkSeries, makeWidthFlexible,} from 'react-vis';

export const Weight = () => {
    const [weights, setWeights] = useState([])

    useEffect(() => {getWeights()}, [])    // runs only when first rendering

    const getWeights = () => {
        axios.get(WEIGHT_URL,token()).then(res => setWeights(res.data))
    }
    
    return(
        <Container style={{ marginTop: "10px" }}>
            <Row>
                <Col>
                    <WeightChart weights={weights} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <WeightInput getWeights={getWeights} />
                </Col>
            </Row>
        </Container>             
    )
}

const WeightInput = ({getWeights}) => {
    const [weight, setWeight] = useState('')
    const createWeight = e =>{
        e.preventDefault()
        axios.post(
            WEIGHT_URL, 
            {"kg": weight},
            token()
        ).then(() => {getWeights()})
    }

    const onChange = e => {
        setWeight(e.target.value)
    }

    return (
        <Form onSubmit={createWeight}>
            <FormGroup row>
                <Label for="kg" sm={3} style={{textAlign: 'center'}}>{new Date().toDateString()}</Label>
                <Col sm={9}>
                <Input id="kg" type="number" step='0.1' value={weight} onChange={onChange} placeholder="Weight(kg)"/>
                </Col>
            </FormGroup>
        </Form>
    )
}


const WeightChart = ({weights}) => {
    let data = weights.map(weight => (
        {x: weight.date, y: weight.kg}
        ))
    let axis = [
          {x: TodayString, y: 55 },
          {x: TodayString, y: 70 },
      ]
    return <FlexibleXYPlot data={data} axis={axis}/>
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