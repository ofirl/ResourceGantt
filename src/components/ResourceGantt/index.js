import React, { useState } from 'react';
import ResourceGantt from './ResourceGantt';

const StatefulResourceGantt = (props) => {
    let [hierColumnWidth, setHierColumnWidth] = useState('100px');

    let stateProps = {
        hierColumnWidth,
        setHierColumnWidth,
    };

    return (
        <ResourceGantt {...props} stateProps={stateProps} />
    );
};

export default StatefulResourceGantt;