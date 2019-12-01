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
        // let startTime = getRndInteger(1573344000000, 1573603199000);
        // let endTime = getRndInteger(startTime + 1, 1573603199000);
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
        position: ({ print }) => print ? null : 'absolute',
        top: ({ print }) => print ? null : '10%',
        left: ({ print }) => print ? null : '10%',
        width: ({ print }) => print ? null : '80%',
        height: ({ print }) => print ? null : '80%',
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
    // {
    //     id: 2,
    //     name: 'test2',
    //     resource: [1],
    //     category: 'cat2',
    //     startTime: '11/11/2019 12:00:00 +0',
    //     endTime: '11/13/2019 00:00:00 +0'
    // },
    // {
    //     id: 3,
    //     name: 'test2',
    //     resource: [1, 3],
    //     category: 'cat3',
    //     startTime: '11/11/2019 12:00:00 +0',
    //     endTime: '11/13/2019 00:00:00 +0'
    // },
];

const categoryColorMap = {
    cat1: 'red',
    cat2: 'green',
}

const TestPage = () => {
    let print = true;
    const classes = useStyles({ print });

    actData.push(...createActivities(50));

    let resourceGanttProps = {
        hierarchy: hierData,
        activities: actData,
        startDate: new Date(Date.parse('11/10/2019 00:00:00 +0')),
        endDate: new Date(Date.parse('12/30/2019 23:59:59 +0')),
        // endDate: new Date(Date.parse('11/12/2019 23:59:59 +0')),
        rtl: true,
        extraData: {
            categoryColorMap,
        },
        hierDefaultOpen: print,
        print,
    }

    return (
        <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'grey', direction: "rtl" }}>
            <div className={classes.testContainer}>
                <ResourceGantt {...resourceGanttProps} />
            </div>
        </div>
    );
};

export default TestPage;