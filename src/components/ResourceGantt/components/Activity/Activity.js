import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    act: ({ actColor, naturalStartOffset, actStartOffsetPercent, gridWidth, actTimeDiffPercent, level, rtl }) => ({
        position: 'absolute',
        background: `${actColor ? actColor : 'yellow'}`,
        left: !rtl ? `calc(${naturalStartOffset} + (${gridWidth}px - ${naturalStartOffset}) * ${actStartOffsetPercent})` : null,
        width: `calc((${gridWidth}px - ${naturalStartOffset}) * ${actTimeDiffPercent})`,
        top: `calc(0.25em + 1.5em * ${level})`,
        right: rtl ? `calc(${naturalStartOffset} + (${gridWidth}px - ${naturalStartOffset}) * ${actStartOffsetPercent})` : null,
        textOverflow: 'ellipsis'
    })
}))

const Activity = ({ act, actPosData: { startDate, endDate, naturalStartOffset, gridDimension: { scrollWidth: gridWidth } }, resource, rtl }) => {
    let actStartTime = new Date(Date.parse(act.startTime));
    let actEndTime = new Date(Date.parse(act.endTime));

    let totalDateDiff = endDate - startDate;
    let actTimeDiff = actEndTime - actStartTime;
    let actTimeDiffPercent = actTimeDiff / totalDateDiff;

    let actStartOffset = actStartTime - startDate;
    let actStartOffsetPercent = actStartOffset / totalDateDiff;

    let styleProps = {
        naturalStartOffset,
        actStartOffsetPercent,
        gridWidth,
        actTimeDiffPercent,
        actColor: act.color,
        level: act.level[resource],
        rtl: rtl
    };

    const classes = useStyles(styleProps);

    return (
        <div className={classes.act}>
            {act.name}
        </div>
    );
};

export default Activity;