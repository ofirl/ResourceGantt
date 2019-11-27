import React, { useRef } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ResourceGantt from '../components/ResourceGantt';

// import { PDFExport } from '@progress/kendo-react-pdf';

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let createActivities = (num) => {
    let acts = [];

    for (let i = 0; i < num; i++) {
        let startTime = getRndInteger(1573344000000, 1577750399000);
        let endTime = getRndInteger(startTime + 1, 1577750399000);
        let res = [];
        res.push(getRndInteger(1, 2));

        acts.push({
            id: i + 20,
            name: 'autotest' + i,
            resource: res,
            category: 'cat' + getRndInteger(1, 3),
            startTime: new Date(startTime).toUTCString(),
            endTime: new Date(endTime).toUTCString()
        });
    }

    return acts;
}

const useStyles = makeStyles(theme => ({
    testContainer: {
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '80%',
        height: '80%',
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
        id: 1,
        name: 'test1',
        resource: [1, 3],
        category: 'cat1',
        startTime: '11/11/2019 00:00:00 +0',
        endTime: '11/12/2019 00:00:00 +0'
    },
    {
        id: 2,
        name: 'test2',
        resource: [1],
        category: 'cat2',
        startTime: '11/11/2019 12:00:00 +0',
        endTime: '11/13/2019 00:00:00 +0'
    },
    {
        id: 3,
        name: 'test2',
        resource: [1, 3],
        category: 'cat3',
        startTime: '11/11/2019 12:00:00 +0',
        endTime: '11/13/2019 00:00:00 +0'
    },
];

const categoryColorMap = {
    cat1: 'red',
    cat2: 'green',
}

const TestPage = () => {
    const classes = useStyles();

    actData.push(...createActivities(1000));

    let resourceGanttProps = {
        hierarchy: hierData,
        activities: actData,
        categoryColorMap,
        startDate: '11/10/2019 00:00:00 +0',
        endDate: '12/30/2019 23:59:59 +0',
        // rtl: true
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