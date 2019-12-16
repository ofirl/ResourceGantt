import React, { useEffect, useRef, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ActivityComponent from './components/ActivityComponent';
import { Popper } from '@material-ui/core';
import ActivityTooltip from './components/ActivityTooltip';

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
    popper: {
        paddingRight: ({ rtl, gridHierColumn }) => rtl ? gridHierColumn : theme.spacing(2),
        paddingLeft: ({ rtl, gridHierColumn }) => rtl ? theme.spacing(2) : gridHierColumn,
        pointerEvents: 'none',
        '& *': {
            transition: 'none',
        },
    },
}));

const Activity = ({ act, actPosData: { startDate, endDate, naturalStartOffset, gridDimension: { scrollWidth: gridWidth } }, resource, rtl, containerRef, extraData, print, gridHierColumn }) => {
    let actRef = useRef();
    let innerActRef = useRef();
    let [visible, setVisible] = useState(true);
    let [popoverOpen, setPopoverOpen] = useState(false);

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
        rtl: rtl,
        gridHierColumn,
    };

    const classes = useStyles(styleProps);

    return (
        <div ref={actRef} className={classes.act}>
            {visible ? (
                <div>
                    <div ref={innerActRef} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}>
                        <ActivityComponent act={act} resource={resource} extraData={extraData} print={print} gridHierColumn={gridHierColumn} rtl={rtl} />
                    </div>
                    {print ? null :
                        (
                            <Popper
                                open={popoverOpen}
                                anchorEl={innerActRef.current}
                                placement="bottom"
                                className={classes.popper}
                                disablePortal={false}
                                modifiers={{
                                    flip: {
                                        enabled: true,
                                    },
                                    preventOverflow: {
                                        enabled: true,
                                        boundariesElement: 'scrollParent',
                                    },
                                }}
                            >
                                <ActivityTooltip rtl={rtl} act={act} />
                            </Popper>
                        )
                    }
                </div>
            ) : null}
        </div>
    );
};

export default Activity;