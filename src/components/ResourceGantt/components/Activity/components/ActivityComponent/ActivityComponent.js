import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({ 
    actStyle: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
}));

const ActivityComponent = ({ act, resource }) => {
    const classes = useStyles();

    return (
        <div className={classes.actStyle}>
            {act.name}
        </div>
    );
};

export default ActivityComponent;