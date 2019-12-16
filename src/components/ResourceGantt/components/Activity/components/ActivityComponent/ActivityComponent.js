import React, { useState, useRef } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Popper } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    actStyle: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        background: ({ actBgColor = 'yellow' }) => actBgColor,
        borderRadius: '0.5em',
        boxShadow: '-2px 2px 8px 0px black',
    },
}));

const ActivityComponent = ({ act, resource, extraData, print, gridHierColumn, rtl }) => {
    let { categoryColorMap } = extraData;

    const classes = useStyles({ actBgColor: categoryColorMap[act.category], gridHierColumn, rtl });

    return (
        <div className={classes.actStyle}>
            {act.name}
        </div>
    );
};

export default ActivityComponent;