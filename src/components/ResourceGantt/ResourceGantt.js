import React, { useState } from 'react';
import Gantt from './components/Gantt';

import { diffInDays, getDateRange } from './../../utils/dateUtils';
import { flattenHierarchy } from '../../utils/hierarchyUtils';

const calcActLevel = (activities) => {
    activities = activities.map((a) => ({ ...a, level: null }))

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

const ResourceGantt = ({ resolution = 2, ...props }) => {
    let [activeHier, setActiveHier] = useState(props.hierarchy);
    let [res, setRes] = useState(resolution);
    let { activities, print, startDate = new Date(), endDate = new Date(Date.now().setDate(Date.now().getDate() + 30)), flatHierarchy } = props;

    const zoomChanged = (zoomLevel) => {
        let newRes = 2;

        if (zoomLevel >= 600)
            newRes = 4;
        if (zoomLevel >= 1200)
            newRes = 5;
        if (zoomLevel >= 7500)
            newRes = 6;

        // console.log('setting res:' + newRes);
        setRes(newRes);
        return newRes;
    };

    // resolution
    // if (!resolution)
    //     resolution = diffInDays(startDate, endDate) > 2 ? 'days' : 'hours';

    // date range
    let dateRange = getDateRange({ startDate, endDate, resolution: res });

    // if it's not a print view - it's simple
    if (!print) {
        let calcActivities = calcActLevel(activities);

        let ganttProps = {
            dateRange,
            resolution: res,
            activities: calcActivities,
            activeHier,
            setActiveHier,
            zoomChanged,
        };

        return (
            <Gantt {...props} {...ganttProps} />
        );
    }

    // print view - complicated
    let rowsInPage = 50;
    let columnsInPage = 20;

    let ganttPrintArr = [];

    let hierarchy = activeHier;
    let flatHier = flattenHierarchy(hierarchy);

    // copy the activities, just in case we want to change something
    let activitiesCopy = activities.map((a) => ({
        ...a,
        resource: [...a.resource],
    }));

    for (let i = 0; i < dateRange.length; i += columnsInPage) {
        let currentStartDate = dateRange[i];
        let currentEndDate = dateRange[Math.min(i + columnsInPage - 1, dateRange.length - 1)];

        // filter only relevant acts
        let currentActivities = activitiesCopy.filter((act) => {
            return act.startTime < currentEndDate && act.endTime > currentStartDate
        })
            // cut startTime and endTime if needed based on print dates and mark the acts
            .map((act) => {
                let correctEndTime = new Date(Math.min(act.endTime, currentEndDate));
                let correctStartTime = new Date(Math.max(act.startTime, currentStartDate));

                return {
                    ...act,
                    endTime: correctEndTime,
                    startTime: correctStartTime,
                    endTimeCut: correctEndTime.getTime() !== act.endTime.getTime(),
                    startTimeCut: correctStartTime.getTime() !== act.startTime.getTime(),
                }
            });

        // calculate act level again
        currentActivities = calcActLevel(currentActivities);

        let currentHier = [];
        let remainingRows = rowsInPage;
        let fullHier = [...flatHier];
        while (fullHier.length > 0) {
            let hierNode = fullHier[0];

            let nodeActsLevels = currentActivities.filter((act) => act.resource.includes(hierNode.id)).map((act) => act.level[hierNode.id]);
            let maxLevel = Math.max(...(nodeActsLevels.length === 0 ? [0] : nodeActsLevels)) + 1;
            if (remainingRows > 0)
                currentHier.push(hierNode);
            if (maxLevel <= remainingRows) {
                remainingRows -= maxLevel;
                fullHier.shift();
                // return;
                continue;
            }

            // need to copy the objects in order to alter them later...
            // eslint-disable-next-line no-loop-func
            let gantActs = currentActivities.filter((act) =>
                act.resource.some((r) => currentHier.find((h) => h.id === r))
            )
                // shallow copy
                .map((act) => ({ ...act, resource: [...act.resource], level: { ...act.level } }));

            // delete not needed acts from gantActs
            // eslint-disable-next-line no-loop-func
            gantActs.filter((act) => act.level[hierNode.id] && act.level[hierNode.id] + 1 > remainingRows)
                .forEach((act, idx) => {
                    act.resource.splice(act.resource.indexOf(hierNode.id), 1);
                });

            // print the gantt (add it to the print array)
            let ganttProps = {
                hierarchy: currentHier,
                startDate: currentStartDate,
                endDate: currentEndDate,
                dateRange: dateRange.slice(i, i + columnsInPage),
                resolution: res,
                activities: gantActs,
                activeHier: currentHier,
                // setActiveHier,
            };

            let componentKey = startDate.getTime() + " " + currentHier[0].id + Math.random();
            ganttPrintArr.push(<div key={componentKey} style={{ width: '27.7cm', minHeight: '19cm' }}><Gantt key={componentKey} {...props} {...ganttProps} /></div>);
            // ganttPrintArr.push(<Gantt key={componentKey} {...props} {...ganttProps} />);
            if (i !== dateRange.length - 1)
                ganttPrintArr.push(...[<br key={componentKey + 1} />, <br key={componentKey + 2} />]);

            // delete not needed acts from currentActivities
            // eslint-disable-next-line no-loop-func
            currentActivities.filter((act) => act.level[hierNode.id] != null && act.level[hierNode.id] + 1 <= remainingRows)
                .forEach((act) => {
                    act.resource.splice(act.resource.indexOf(hierNode.id), 1);
                });

            // update remaining acts levels in currentActivities
            currentActivities = calcActLevel(currentActivities);

            currentHier = [];
            remainingRows = rowsInPage;
        }

        let ganttProps = {
            hierarchy: currentHier,
            startDate: currentStartDate,
            endDate: currentEndDate,
            dateRange: dateRange.slice(i, i + columnsInPage),
            resolution: res,
            activities: currentActivities,
            activeHier: currentHier,
        };

        ganttPrintArr.push(<div key={i} style={{ width: '27.7cm', minHeight: '19cm' }}><Gantt key={i} {...props} {...ganttProps} /></div>);
        // ganttPrintArr.push(<Gantt key={i} {...props} {...ganttProps} />);

        if (i !== dateRange.length - 1)
            ganttPrintArr.push(...[<div key={i + 1} style={{ pageBreakAfter: 'always' }} />, <br key={i + 2} />]);
    }

    return ganttPrintArr;
};

export default ResourceGantt;