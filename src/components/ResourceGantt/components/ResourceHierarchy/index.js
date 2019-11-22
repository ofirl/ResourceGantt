import React from 'react';
import ResourceHierarchy from './ResourceHierarchy';

const StatefulResourceHierarchy = (props) => {
    let { activities, categoryColorMap } = props;

    let calcActivities = activities.map((act) => {
        let resourceLevel = {};
        act.resource.forEach((r) => {
            resourceLevel[r] = activities.filter((actCol) =>
                act.id > actCol.id &&
                actCol.resource.some((rCol) => r === rCol) &&
                act.startTime < actCol.endTime && act.endTime > actCol.startTime
            ).length;
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