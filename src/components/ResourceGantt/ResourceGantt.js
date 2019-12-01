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
    if (!resolution)
        resolution = diffInDays(startDate, endDate) > 2 ? 'days' : 'hours';

    let dateRange = getDateRange({ startDate, endDate });

    return (
        <Gantt {...props} />
    );
};

export default ResourceGantt;