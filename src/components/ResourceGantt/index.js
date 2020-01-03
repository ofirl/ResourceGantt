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
    let { ganttTheme, printable = true, filter } = props;
    if (ganttTheme == null)
        ganttTheme = defaultTheme;

    let flatHier = flattenHierarchy(props.hierarchy);

    let { startDate, endDate, activities } = props;

    activities = activities.map((act) => ({
        ...act,
        startTime: new Date(Date.parse(act.startTime)),
        endTime: new Date(Date.parse(act.endTime)),
    }));

    let outOfRangeActs = [];

    activities = activities.map((act) => {
        // save out of range acts ids
        if (act.startTime > endDate || act.endTime < startDate) {
            outOfRangeActs.push(act.id);
            return act;
        }

        // TODO: check timesaving, sometimes it will need to be +3....
        let modifiedActStartTime = new Date(act.startTime);
        modifiedActStartTime.setHours(act.startTime.getHours() + 2);
        let modifiedActEndTime = new Date(act.endTime);
        modifiedActEndTime.setHours(act.endTime.getHours() + 2);

        let correctEndTime = new Date(Math.min(modifiedActEndTime, endDate));
        let correctStartTime = new Date(Math.max(modifiedActStartTime, startDate));
        // let correctStartTime = new Date(Math.max(act.startTime, startDate));
        // let correctEndTime = new Date(Math.min(act.endTime, endDate));

        return {
            ...act,
            endTime: correctEndTime,
            startTime: correctStartTime,
            originalStartTime: act.startTime,
            originalEndTime: act.endTime,
            endTimeCut: correctEndTime.getTime() !== modifiedActEndTime.getTime(),
            startTimeCut: correctStartTime.getTime() !== modifiedActStartTime.getTime(),
        }
    });

    Object.keys(filter).forEach((fk) => {
        activities = activities.filter((act) => filter[fk].callback(filter[fk].value, act[fk]));
    });

    // if (filter.category)
    //     activities = activities.filter((act) => filter.category.includes(act.category));

    // if (filter.resource)
    //     activities = activities

    // remove out of range acts
    outOfRangeActs.forEach((id) => {
        activities.splice(activities.findIndex((a) => a.id === id), 1);
    });

    return (
        //TODO: wrap in theme provider
        <div id='resourceGantt' style={{ height: '100%' }}>
            <ResourceGantt {...props} activities={activities} ganttTheme={ganttTheme} flatHierarchy={flatHier} printable={printable} />
        </div>
    );
};

export default StatefulResourceGantt;