import React, { useState, useRef } from 'react';
import Gantt from './Gantt';

const minDateColumnWidthMultiplier = [
    12 * 12, //year
    12, //month
    1, //day
    0.5, //12 hours
    1/24, // hours
    1/48, // half hour
    1/24 * 1/6, //10 minutes
];

const StatefulGantt = (props) => {
    let [hierColumnWidth, setHierColumnWidth] = useState(200);
    let [minDateColumnWidth, setMinDateColumnWidth] = useState(20);
    let [zoomLevel, setZoomLevel] = useState(20);
    let scrollPosHandler = useRef();

    let changeZoom = (val) => {
        if (zoomLevel <= 20 && val < 0)
            return;

        let newZoomLevel = zoomLevel + val;
        setZoomLevel(newZoomLevel);
        let res;
        if (props.zoomChanged)
            res = props.zoomChanged(newZoomLevel);

        // console.log('zoom level:' + newZoomLevel);
        // console.log('new width:' + newZoomLevel * minDateColumnWidthMultiplier[res ? res : props.resolution]);
        // console.log('res:' + res);
        setMinDateColumnWidth(newZoomLevel * minDateColumnWidthMultiplier[res ? res : props.resolution]);
        // props.zoomChanged && props.zoomChanged(newZoomLevel);
    };

    let zoomIn = () => {
        scrollPosHandler.current.saveScrollPos();
        changeZoom(100);
        setTimeout(() => scrollPosHandler.current.setScrollPos(), 1);
        // scrollPosHandler.current.setScrollPos();
    };

    let zoomOut = () => {
        scrollPosHandler.current.saveScrollPos();
        changeZoom(-100);
        setTimeout(() => scrollPosHandler.current.setScrollPos(), 1);
        // scrollPosHandler.current.setScrollPos();
    };

    let changeHierColumnWidth = (num) => {
        setHierColumnWidth(hierColumnWidth + num);
    };

    let stateProps = {
        hierColumnWidth: hierColumnWidth + "px",
        changeHierColumnWidth,
        minDateColumnWidth: minDateColumnWidth + "px",
        //TODO : use it (get a zoom button or something....)
        // setMinDateColumnWidth
    };

    let stateHandlers = {
        zoomIn,
        zoomOut
    }

    return (
        <Gantt scrollPosHandler={scrollPosHandler} {...props} stateProps={stateProps} stateHandlers={stateHandlers} />
    );
};

export default StatefulGantt;