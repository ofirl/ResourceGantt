import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ResourceGantt from '../components/ResourceGantt';

const useStyles = makeStyles(theme => ({
    testContainer: {
        position: 'absolute',
        top: '25%',
        left: '25%',
        width: '50%',
        height: '50%',
        background: 'white',
    }
}));

const hierData = [
    {
        id: 1,
        name: 'root1',
        children: [
            {
                id: 3,
                name: 'child1'
            }
        ]
    },
    {
        id: 2,
        name: 'root2',
        children: [
            {
                id: 4,
                name: 'child2',
                children: [
                    {
                        id: 6,
                        name: 'child3'
                    }
                ]
            },
            {
                id: 5,
                name: 'child4',
            },
        ]
    },
];

const actData = [
    {
        id: '1',
        name: 'test1',
        resource: [1,3],
        category: 'cat1',
        startTime: '11/11/2019 00:00:00 +0',
        endTime: '11/12/2019 00:00:00 +0'
    },
    {
        id: '2',
        name: 'test2',
        resource: [1],
        category: 'cat2',
        startTime: '11/11/2019 12:00:00 +0',
        endTime: '11/13/2019 00:00:00 +0'
    }
];

const categoryColorMap = {
    cat1: 'red',
    cat2: 'green',
}

const TestPage = () => {
    const classes = useStyles();

    let resourceGanttProps = {
        hierarchy: hierData,
        activities: actData,
        categoryColorMap,
        startDate: '11/10/2019 00:00:00 +0', 
        endDate: '12/30/2019 23:59:59 +0',
    }

    return (
        <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'grey' }}>
            <div className={classes.testContainer}>
                <ResourceGantt {...resourceGanttProps} />
            </div>
        </div>
    );
};

export default TestPage;