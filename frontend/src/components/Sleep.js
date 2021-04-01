import axios from "axios";

import {token} from "../constants/axiosDefault"
import React, {useState, useEffect} from 'react'
import {SLEEP_URL} from '../constants'

import PropTypes from 'prop-types';

import "react-vis/dist/style.css";
import {XYPlot, XAxis, YAxis, LineMarkSeries, Crosshair, VerticalBarSeries, makeWidthFlexible, 
    VerticalGridLines, HorizontalGridLines, DiscreteColorLegend, MarkSeries } from 'react-vis';

export const Sleep = () => {
    const [sleep, setSleep] = useState()

    useEffect(() => {getSleep()}, [])


    const getSleep = () =>{
        axios.get(SLEEP_URL, token())
        .then(res => {
            setSleep(res.data)
        })
    }

    if(sleep){
        console.log(sleep)
        return <SleepView sleep={sleep} setSleep={setSleep} />
    }else{
        return <div> sleep tight.</div>
    }
}


const SleepView = ({sleep}) => {

    console.log(sleep)

    return (<div>
        {/* Maybe add form component here */}
        <SleepViz sleep={sleep} />
    </div>)
}

const SleepViz = ({sleep}) => {
    const [crosshair, setCrosshair] = useState([])

    /**
     * time string to int lateral. 12:00 AM is gonna be 0 (at the bottom of the chart), and 10:00 PM (22:00) is gonna be top
     */
    const TimeSerialize = (timeString) => {
        let h = parseInt(timeString.slice(0,2))
        let t = parseInt(timeString.slice(3,5))
        
        let res
        if(h>21){
            res = 12 + (24-h)
        }else{
            res = 12 - h
        }

        res = 60*res // 0 - 840
        res -= t
        return res
    }

    const DurationChecker = (bedin, wakeup) => {
        let du = TimeSerialize(bedin) - TimeSerialize(wakeup)
        du = du/60
        return du.toString().slice(0,3) + 'hrs'
    }
    
    let bedinSeries = sleep.map(s => ({x: s.date, y: TimeSerialize(s.bedin) }))
    let wakeupSeries = sleep.map(s => ({x: s.date, y: TimeSerialize(s.wakeup) }))

    let panelSeries = sleep.map(s => ({x: s.date, y: `${s.bedin.slice(0,5)} - ${s.wakeup.slice(0,5)}`}))
    let durationSeries = sleep.map(s => DurationChecker(s.bedin, s.wakeup))

    let axis = [
        {x: sleep[0].date, y: 0 },
        {x: sleep[0].date, y: 840 },
    ]

    return <FlexibleXYPlot axis={axis} bi={bedinSeries} wu={wakeupSeries} ps={panelSeries} ds={durationSeries} crosshair={crosshair} set={setCrosshair} />
}

const Plot = ({width, axis, bi, wu, ps, ds, crosshair, set}) => 
    <XYPlot 
        onMouseLeave={() => set([])}
        width={width} height={500} xType="ordinal"
        margin={{left: 50}}
        >
        <XAxis tickValues={[]}/>
        {/* <YAxis title="time" tickValues={[0,60,120,180,240,300,360,420,480,540,600,660,720,780,840]} 
            style={{text: {stroke: 'none', fill: 'none'}}}/> */}
        <VerticalGridLines />
        <HorizontalGridLines tickValues={[0,60,120,180,240,300,360,420,480,540,600,660,720,780,840]} />

        <MarkSeries 
              data={axis} 
              style={{ display: 'none' }} />
        <LineMarkSeries
            data={bi}
            onNearestX = {(value, {index}) => {
                let newHair = [ps[index], ds[index]]
                set(newHair)
            }}
            opacity={0.9}/>
        <LineMarkSeries data={wu} />
        <Crosshair 
            values = {crosshair}
            titleFormat = {(d) => ({title: d[0].x, value: d[1]})}
            itemsFormat = {(d) => ([
                    {title: 'duration', value: d[0].y}
                ])}
        />
    </XYPlot>


Plot.propTypes = { width: PropTypes.number, measurements: PropTypes.array }
Plot.displayName = 'SleepChart'
const FlexibleXYPlot = makeWidthFlexible(Plot)