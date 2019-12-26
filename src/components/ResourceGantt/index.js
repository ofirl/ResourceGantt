import React from 'react';
import ResourceGantt from './ResourceGantt';

import { flattenHierarchy } from '../../utils/hierarchyUtils';

const defaultTheme = {
    border: '1px solid #999',
    hierBackground: '#122342',
    hierColor: 'white',
    headerRowBackground: '#122342',
    headerRowColor: 'white',
    topPanelBackground: 'orange',
    topPanelColor: 'black',
};

const StatefulResourceGantt = (props) => {
    let { ganttTheme } = props;
    if (ganttTheme == null)
        ganttTheme = defaultTheme;

    let flatHier = flattenHierarchy(props.hierarchy);

    let { startDate, endDate, activities } = props;

    activities = activities.map((act) => ({
        ...act,
        startTime: new Date(Date.parse(act.startTime)),
        endTime: new Date(Date.parse(act.endTime)),
    }));

    activities = activities.map((act) => {
        let correctEndTime = new Date(Math.min(act.endTime, endDate));
        let correctStartTime = new Date(Math.max(act.startTime, startDate));

        return {
            ...act,
            endTime: correctEndTime,
            startTime: correctStartTime,
            originalStartTime: act.startTime,
            originalEndTime: act.endTime,
            endTimeCut: correctEndTime.getTime() !== act.endTime.getTime(),
            startTimeCut: correctStartTime.getTime() !== act.startTime.getTime(),
        }
    });

    return (
        //TODO: wrap in theme provider
        <div id='resourceGantt'>
        <ResourceGantt {...props} activities={activities} ganttTheme={ganttTheme} flatHierarchy={flatHier} />
        </div>
    );
};

export default StatefulResourceGantt;