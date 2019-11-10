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
        name: 'root1',
        children: [
            {
                name: 'child1'
            }
        ]
    },
    {
        name: 'root2',
        children: [
            {
                name: 'child2',
                children: [
                    {
                        name: 'child3'
                    }
                ]
            },
            {
                name: 'child4',
            },
        ]
    },
];

const TestPage = () => {
    const classes = useStyles();

    return (
        <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'grey' }}>
            <div className={classes.testContainer}>
                <ResourceGantt hierarchy={hierData} />
            </div>
        </div>
    );
};

export default TestPage;