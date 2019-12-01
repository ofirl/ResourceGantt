import React from 'react';
import Gantt from './components/Gantt';

import { diffInDays, getDateRange } from './../../utils/dateUtils';

const ResourceGantt = (props) => {
    let { activities, print, startDate = new Date(), endDate = new Date(Date.now().setDate(Date.now().getDate() + 30)), resolution = "days" } = props;

    // resolution
    if (!resolution)
        resolution = diffInDays(startDate, endDate) > 2 ? 'days' : 'hours';

    // date range
    let dateRange = getDateRange({ startDate, endDate });

    // activities
    activities = activities.map((act) => ({
        ...act,
        startTime: new Date(Date.parse(act.startTime)),
        endTime: new Date(Date.parse(act.endTime)),
    }));

    let prevActivities = [];

    let calcActivities = activities.map((act) => {
        let resourceLevel = {};
        act.resource.forEach((r) => {
            let collisionArr = prevActivities.filter((actCol) => act.id > actCol.id &&
                actCol.resource.some((rCol) => r === rCol) &&
                act.startTime < actCol.endTime && act.endTime > actCol.startTime
            );

            resourceLevel[r] = collisionArr.length === 0 ? 0 : Math.max(...collisionArr.map((actCol) => actCol.level[r])) + 1;
        });

        prevActivities.push({
            ...act,
            level: resourceLevel,
        });

        return {
            ...act,
            level: resourceLevel,
        };
    });

    // if it's not a print view
    if (!print) {
        let ganttProps = {
            dateRange,
            resolution,
            activities: calcActivities
        };

        return (
            <Gantt {...props} {...ganttProps} />
        );
    }

    // print view
    let rowsInPage = 10;
    let columnsInPage = 5;

    let ganttPrintArr = [];
    let { hierarchy } = props;

    for (let i = 0; i < dateRange.length; i += columnsInPage) {
        let currentStartDate = dateRange[i];
        let currentEndDate = dateRange[i + columnsInPage - 1];

        let ganttProps = {
            startDate: currentStartDate,
            endDate: currentEndDate,
            dateRange: dateRange.slice(i, i + columnsInPage),
            resolution,
            activities: calcActivities.filter( (act) => {
                return act.startTime < currentEndDate && act.endTime > currentStartDate
            }) // TODO : cut the act endDate/startDate and mark it for ux
        };

        ganttPrintArr.push(<Gantt key={i} {...props} {...ganttProps} />);
        ganttPrintArr.push(<br key={i+1} />);
    }

    return ganttPrintArr;
};

export default ResourceGantt;