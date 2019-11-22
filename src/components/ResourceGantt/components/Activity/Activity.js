import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    act: {
        position: 'absolute',
        background: ({ actColor }) => `${actColor}`,
        left: ({ naturalStartOffset, actStartOffsetPercent, gridWidth }) => `calc(${naturalStartOffset} + (${gridWidth}px - ${naturalStartOffset}) * ${actStartOffsetPercent})`,
        width: ({ naturalStartOffset, gridWidth, actTimeDiffPercent }) => `calc((${gridWidth}px - ${naturalStartOffset}) * ${actTimeDiffPercent})`,
    }
}))

const Activity = ({ act, actPosData: { startDate, endDate, naturalStartOffset, gridDimension: { scrollWidth: gridWidth } }, color: actColor }) => {
    console.log(gridWidth);
    let actStartTime = new Date(Date.parse(act.startTime));
    let actEndTime = new Date(Date.parse(act.endTime));

    let totalDateDiff = endDate - startDate;
    let actTimeDiff = actEndTime - actStartTime;
    let actTimeDiffPercent = actTimeDiff / totalDateDiff;

    let actStartOffset = actStartTime - startDate;
    let actStartOffsetPercent = actStartOffset / totalDateDiff;

    const classes = useStyles({ naturalStartOffset, actStartOffsetPercent, gridWidth, actTimeDiffPercent, actColor });

    return (
        <div className={classes.act}>
            {act.name}
        </div>
    );
};

export default Activity;