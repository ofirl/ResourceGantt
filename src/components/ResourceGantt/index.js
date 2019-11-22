import React, { useState } from 'react';
import ResourceGantt from './ResourceGantt';

const StatefulResourceGantt = (props) => {
    let [hierColumnWidth, setHierColumnWidth] = useState('100px');

    let stateProps = {
        hierColumnWidth,
        //TODO : use it (set a draggable handler or something....)
        setHierColumnWidth,
    };

    return (
        <ResourceGantt {...props} stateProps={stateProps} />
    );
};

export default StatefulResourceGantt;