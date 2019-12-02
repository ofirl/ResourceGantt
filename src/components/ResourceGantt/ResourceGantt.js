import React from 'react';
import Gantt from './components/Gantt';

import { diffInDays, getDateRange } from './../../utils/dateUtils';

const calcActLevel = (activities) => {
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

    return calcActivities;
};

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

    // if it's not a print view - it's simple
    if (!print) {
        let calcActivities = calcActLevel(activities);

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

        // filter only relevant acts
        let currentActivities = activities.filter((act) => {
            return act.startTime < currentEndDate && act.endTime > currentStartDate
        })
            // cut startTime and endTime if needed
            .map((act) => ({
                ...act,
                endTime: new Date(Math.min(act.endTime, currentEndDate)),
                startTime: new Date(Math.max(act.startTime, currentStartDate)),
            }));

        // calculate act level again
        currentActivities = calcActLevel(currentActivities);

        let ganttProps = {
            startDate: currentStartDate,
            endDate: currentEndDate,
            dateRange: dateRange.slice(i, i + columnsInPage),
            resolution,
            activities: currentActivities,
        };

        ganttPrintArr.push(<Gantt key={i} {...props} {...ganttProps} />);

        if (i !== dateRange.length - 1)
            ganttPrintArr.push(...[<br key={i + 1} />, <br key={i + 2} />]);
    }

    return ganttPrintArr;
};

export default ResourceGantt;