import React, { useState, useRef } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { Popper } from '@material-ui/core';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
    actStyle: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        background: ({ actBgColor = '#e6e66d' }) => actBgColor,
        borderRadius: '0.5em',
        boxShadow: '-2px 2px 8px 0px #999',
    },
    actStyleFirefox: {
        overflow: '-moz-hidden-unscrollable',
    },
    actName: {
        // position: 'sticky',
        // right: '50%',
        // width: 'min-content'
    },
}));

const ActivityComponent = ({ act, resource, extraData, print, gridHierColumn, rtl }) => {
    let { categoryColorMap } = extraData;

    const classes = useStyles({ actBgColor: categoryColorMap[act.category], gridHierColumn, rtl });

    return (
        <div className={classNames(classes.actStyle, classes.actStyleFirefox)}>
            {/* <div> */}
                {/* <div className={classes.actName}> */}
                    {act.name}
                {/* </div> */}
            {/* </div> */}
        </div>
    );
};

export default ActivityComponent;