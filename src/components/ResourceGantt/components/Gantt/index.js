import React, { useState, useRef } from 'react';
import Gantt from './Gantt';

const StatefulGantt = (props) => {
    let [hierColumnWidth, setHierColumnWidth] = useState(200);
    let [minDateColumnWidth, setMinDateColumnWidth] = useState(20);
    let scrollPosHandler = useRef();

    let changeZoom = (val) => {
        if (minDateColumnWidth <= 20 && val < 0)
            return;

        setMinDateColumnWidth(minDateColumnWidth + val);
    };

    let zoomIn = () => {
        scrollPosHandler.current.saveScrollPos();
        changeZoom(20);
        scrollPosHandler.current.setScrollPos();
    };

    let zoomOut = () => {
        scrollPosHandler.current.saveScrollPos();
        changeZoom(-20);
        scrollPosHandler.current.setScrollPos();
    };

    let changeHierColumnWidth = (num) => {
        setHierColumnWidth(hierColumnWidth + num);
    };

    let stateProps = {
        hierColumnWidth: hierColumnWidth + "px",
        //TODO : use it (set a draggable handler or something....)
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