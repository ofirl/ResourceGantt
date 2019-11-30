import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    actStyle: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        background: ({ actBgColor = 'yellow' }) => actBgColor,
    },
}));

const ActivityComponent = ({ act, resource, extraData }) => {
    let { categoryColorMap } = extraData;
    
    const classes = useStyles({ actBgColor: categoryColorMap[act.category] });

    return (
        <div className={classes.actStyle}>
            {act.name}
        </div>
    );
};

export default ActivityComponent;