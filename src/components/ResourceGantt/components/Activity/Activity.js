import React, { useEffect, useRef, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ActivityComponent from './components/ActivityComponent';

// import VisibilitySensor from 'react-visibility-sensor';

const useStyles = makeStyles(theme => ({
    act: ({ actColor, naturalStartOffset, actStartOffsetPercent, gridWidth, actTimeDiffPercent, level, rtl }) => ({
        position: 'absolute',
        left: !rtl ? `calc(${naturalStartOffset} + (${gridWidth}px - ${naturalStartOffset}) * ${actStartOffsetPercent})` : null,
        width: `calc((${gridWidth}px - ${naturalStartOffset}) * ${actTimeDiffPercent})`,
        top: `calc(0.25em + 1.5em * ${level})`,
        right: rtl ? `calc(${naturalStartOffset} + (${gridWidth}px - ${naturalStartOffset}) * ${actStartOffsetPercent})` : null,
        // textOverflow: 'ellipsis',
        // transition: 'inherit',
        // overflow: 'hidden',
        whiteSpace: 'nowrap',
    }),
}))

const Activity = ({ act, actPosData: { startDate, endDate, naturalStartOffset, gridDimension: { scrollWidth: gridWidth } }, resource, rtl, containerRef, extraData }) => {
    let actRef = useRef();
    let [visible, setVisible] = useState(true);
    // useEffect(() => {
    //     const observer = new IntersectionObserver(
    //         ([entry]) => {
    //             if (entry.intersectionRatio > 0.05)
    //                 setVisible(true);
    //             if (entry.intersectionRatio <= 0.05)
    //                 setVisible(false);
    //             // console.log(entry.intersectionRatio);
    //         },
    //         {
    //             root: containerRef.current,
    //             rootMargin: '50px',
    //             threshold: [0, 0.05, 1]
    //         });

    //         if (actRef.current) {
    //             observer.observe(actRef.current)
    //         }
    // }, []);

    let actStartTime = act.startTime;
    let actEndTime = act.endTime;

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
        <div ref={actRef} className={classes.act}>
            {visible ? <ActivityComponent act={act} resource={resource} extraData={extraData} /> : null}
        </div>
    );
};

export default Activity;