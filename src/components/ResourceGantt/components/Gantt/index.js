import React, { useState } from 'react';
import Gantt from './Gantt';

const StatefulGantt = (props) => {
    let [hierColumnWidth, setHierColumnWidth] = useState(100);
    let [minDateColumnWidth, setMinDateColumnWidth] = useState(20);

    let changeZoom = (val) => {
        if (minDateColumnWidth <= 20 && val < 0)
            return;

        setMinDateColumnWidth(minDateColumnWidth + val);
    };

    let zoomIn = () => {
        changeZoom(20);
    };

    let zoomOut = () => {
        changeZoom(-20);
    };

    let stateProps = {
        hierColumnWidth: hierColumnWidth + "px",
        //TODO : use it (set a draggable handler or something....)
        setHierColumnWidth,
        minDateColumnWidth: minDateColumnWidth + "px",
        //TODO : use it (get a zoom button or something....)
        // setMinDateColumnWidth
    };

    let stateHandlers = {
        zoomIn,
        zoomOut
    }

    return (
        <Gantt {...props} stateProps={stateProps} stateHandlers={stateHandlers} />
    );
};

export default StatefulGantt;