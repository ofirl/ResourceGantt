import React from 'react';
import ResourceHierarchy from './ResourceHierarchy';

const StatefulResourceHierarchy = (props) => {
    let { activities, categoryColorMap } = props;

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
            color: categoryColorMap[act.category]
        });

        return {
            ...act,
            level: resourceLevel,
            color: categoryColorMap[act.category]
        };
    });

    return (
        <ResourceHierarchy {...props} activities={calcActivities} />
    );
};

export default StatefulResourceHierarchy;