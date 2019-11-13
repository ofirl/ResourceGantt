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
        name: 'test1',
        resource: [1,2],
        startTime: '12/11/2019 12:05',
        endTime: '12/11/2019 13:05'
    }
];

const TestPage = () => {
    const classes = useStyles();

    return (
        <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'grey' }}>
            <div className={classes.testContainer}>
                <ResourceGantt hierarchy={hierData} activities={actData} startDate={'11/10/2019 00:00:00 +0'} endDate={'11/15/2019 00:00:00 +0'} />
            </div>
        </div>
    );
};

export default TestPage;