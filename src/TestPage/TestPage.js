import React, { useRef, useState } from 'react';

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
        res.push(getRndInteger(1, 5));

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
        // top: ({ print }) => print ? null : '10%',
        // left: ({ print }) => print ? null : '10%',
        // width: ({ print }) => print ? null : '80%',
        // height: ({ print }) => print ? null : '80%',
        top: ({ print }) => print ? null : '0',
        left: ({ print }) => print ? null : '0',
        width: ({ print }) => print ? null : '100%',
        height: ({ print }) => print ? null : '100%',
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
    // ...[1, 2, 3, 4, 5, 6, 7].map((i) => ({
    //     id: i,
    //     name: 'test' + i,
    //     resource: [1, 3],
    //     category: 'cat1',
    //     startTime: '11/11/2019 00:00:00 +0',
    //     endTime: '12/29/2019 00:00:00 +0'
    // })),
    {
        id: 10,
        name: 'test10',
        resource: [1, 3],
        category: 'cat1',
        startTime: '11/11/2019 05:00:00 +0',
        endTime: '01/11/2020 10:00:00 +0'
    }
    // {
    //     id: 1,
    //     name: 'test1',
    //     resource: [1, 3],
    //     category: 'cat1',
    //     startTime: '11/11/2019 00:00:00 +0',
    //     endTime: '11/12/2019 00:00:00 +0'
    // },
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
    // {
    //     id: 4,
    //     name: 'test2',
    //     resource: [1, 3],
    //     category: 'cat3',
    //     startTime: '11/11/2019 12:00:00 +0',
    //     endTime: '11/13/2019 00:00:00 +0'
    // },
    // {
    //     id: 5,
    //     name: 'test2',
    //     resource: [1, 3],
    //     category: 'cat3',
    //     startTime: '11/11/2019 12:00:00 +0',
    //     endTime: '11/13/2019 00:00:00 +0'
    // },
    // {
    //     id: 6,
    //     name: 'test2',
    //     resource: [1, 3],
    //     category: 'cat3',
    //     startTime: '11/11/2019 12:00:00 +0',
    //     endTime: '11/13/2019 00:00:00 +0'
    // },
    // {
    //     id: 7,
    //     name: 'test2',
    //     resource: [1, 3],
    //     category: 'cat3',
    //     startTime: '11/11/2019 12:00:00 +0',
    //     endTime: '11/13/2019 00:00:00 +0'
    // },
];

const categoryColorMap = {
    cat1: '#f29494',
    cat2: '#86db86',
}

const TestPage = () => {
    let [print, setPrint] = useState(false);
    const [startDate, setStartDate] = useState(new Date(Date.parse('11/10/2019 00:00:00 +0')));
    const [endDate, setEndDate] = useState(new Date(Date.parse('12/31/2019 23:59:59 +0')));
    const [filter, setFilter] = useState({
        category: {
            allValues: ['cat1', 'cat2'],
            value: [],
            callback: (filter, value) => filter.length > 0 ? filter.includes(value) : true,
        }
    });

    const applyFilter = () => {

    };

    const classes = useStyles({ print });

    let randomActsNum = 50;
    if (actData.length < randomActsNum)
        actData.push(...createActivities(50));

    let resourceGanttProps = {
        hierarchy: hierData,
        activities: actData,
        startDate,
        endDate,
        setStartDate,
        setEndDate: (date) => setEndDate(date.setDate(date.getDate() + 1)),
        rtl: true,
        extraData: {
            categoryColorMap,
        },
        hierDefaultOpen: print,
        print,
        // printable: false,
        onPrintClick: () => setPrint(!print),
        filter,
        setFilter,
    }

    // right: `${print ? '1cm' : null}`
    return (
        <div style={{ position: 'absolute', width: `${print ? null : '100%'}`, height: '100%', right: `${print ? '1cm' : '0'}`, background: 'grey', direction: `${resourceGanttProps.rtl ? 'rtl' : 'ltr'}` }}>
            {/* <button type="button" style={{ zIndex: '20', position: 'absolute' }} onClick={() => setPrint(!print)}> print </button> */}
            <div className={classes.testContainer}>
                <ResourceGantt {...resourceGanttProps} />
            </div>
        </div>
    );
};

export default TestPage;