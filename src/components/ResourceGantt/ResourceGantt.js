import React from 'react';
import Gantt from './components/Gantt';

const ResourceGantt = (props) => {
    let { print } = props;

    // if it's not a print view
    if (!print)
        return (
            <Gantt {...props} />
        );

    // print view
    
};

export default ResourceGantt;