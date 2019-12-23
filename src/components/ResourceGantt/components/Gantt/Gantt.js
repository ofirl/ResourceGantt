import React, { Fragment, useRef, useState } from 'react';
import TopPanel from './../../components/TopPanel';
import { ThemeProvider } from '@material-ui/core/styles';

import { Grid, Cell } from "styled-css-grid";
import ResourceHierarchy from './../../components/ResourceHierarchy';

import defaultTheme from './../../defaultTheme';
import HeaderRow from './../../components/HeaderRow';
import { diffInDays, getDateRange } from './../../../../utils/dateUtils';

import { makeStyles } from '@material-ui/core/styles';
import useDimensions from './../../../../customHooks/useDimensions/useDimensions';
import HierarchySelector from './components/HierarchySelector';
import { flattenHierarchy } from './../../../../utils/hierarchyUtils';

const useStyles = makeStyles(theme => ({
    outsideContainer: {
        height: '100%'
    },
    mainGrid: {
        transition: ({ dragging }) => dragging ? 'none' : 'ease 1s',
        '& *': {
            transition: 'inherit',
        },
        overflow: ({ print }) => print ? 'visible' : 'scroll',
        position: 'relative',
        height: '100%',
        width: '100%',
        right: ({ print }) => print ? '0%' : null,
    },
    headerRowCell: {
        position: ({ print }) => print ? null : 'sticky',
        top: '0',
        zIndex: '2',
    },
    resizeHandler: {
        position: 'sticky',
        left: ({ rtl, gridHierColumn }) => rtl ? null : gridHierColumn,
        right: ({ rtl, gridHierColumn }) => rtl ? gridHierColumn : null,
        zIndex: '3',
        cursor: 'col-resize',
        transform: 'translateX(6px)',
    },
    hierarchyShadow: {
        position: 'sticky',
        left: ({ rtl, gridHierColumn }) => rtl ? null : gridHierColumn,
        right: ({ rtl, gridHierColumn }) => rtl ? gridHierColumn : null,
        zIndex: '1',
        boxShadow: '-2px 0px 8px 0px black',
        transform: 'translateX(6px)',
    },
    hierarchyEditCell: {
        // zIndex: ({ editHier }) => editHier ? '2' : null,
        zIndex: '2',
        position: 'sticky',
        right: ({ rtl }) => rtl ? '0' : null,
        left: ({ rtl }) => rtl ? null : '0',
        width: ({ editHier }) => editHier ? '100%' : '0',
        transition: 'all 0.5s ease',
    },
    hierarchyEdit: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        // width: ({ editHier }) => editHier ? '100%' : '0'
    },
}))

const Gantt = ({ hierarchy = [], activities = [], startDate, endDate, dateRange, resolution, rtl, stateProps, stateHandlers, extraData, hierDefaultOpen, print, 
    scrollPosHandler, ganttTheme, flatHierarchy, activeHier, setActiveHier }) => {
    let [editHier, setEditHier] = useState(false);
    let [tempHier, setTempHier] = useState(hierarchy);
    const [gridRef, gridDimension, reMeasure] = useDimensions();
    let containerRef = useRef();
    let mainGridRef = useRef();
    let scrollPos = useRef(0);
    let dragObj = useRef({});

    // TODO: fix it later, the screen jumps on the first pixel when the mouse moves on drag probably because of the starting value of dragObj
    // console.log(stateProps.hierColumnWidth);
    // if (stateProps.hierColumnWidth != null)
    //     console.log(parseInt(stateProps.hierColumnWidth.substring(0, stateProps.hierColumnWidth.length - 2)));

    let classes = useStyles({ print, rtl, gridHierColumn: stateProps.hierColumnWidth, ganttTheme, dragging: dragObj.current.dragging, editHier });

    let saveScrollPos = () => {
        // scrollPos.current = containerRef.current.scrollLeft / (gridDimension.scrollWidth - gridDimension.width);

        // console.log((gridDimension.scrollWidth - gridDimension.width));
        // console.log('scroll saved! ' + scrollPos.current);
    };

    // TODO: something is wrong here!!!!!!
    let setScrollPos = () => {
        // console.log((gridDimension.scrollWidth - gridDimension.width));
        // console.log(Math.round((gridDimension.scrollWidth - gridDimension.width) * scrollPos.current));

        // containerRef.current.scrollTo(Math.round((gridDimension.scrollWidth - gridDimension.width) * scrollPos.current), containerRef.current.scrollTop);

        // console.log('scroll set!');
    };

    scrollPosHandler.current = {
        saveScrollPos,
        setScrollPos,
    };

    const updateDragWidth = () => {
        stateProps.changeHierColumnWidth(dragObj.current.startDragPos - dragObj.current.currentDragPos);
    };

    const mouseMoveHandler = (e) => {
        dragObj.current.currentDragPos = e.screenX;
    };

    const dragStart = (e) => {
        dragObj.current.startDragPos = e.screenX;
        dragObj.current.currentDragPos = e.screenX;
        dragObj.current.dragging = true;
        dragObj.current.dragTimeout = setInterval(() => updateDragWidth(), 1);
        window.addEventListener('dragover', mouseMoveHandler);
    };

    const dragEnd = (e) => {
        dragObj.current.dragging = false;
        window.removeEventListener('dragover', mouseMoveHandler);
        clearInterval(dragObj.current.dragTimeout);
    };

    const saveHier = () => {
        setEditHier(false);
        setActiveHier(tempHier);
    };

    const cancelHierEdit = () => {
        setEditHier(false);
        setTempHier(activeHier);
    };

    // console.log(gridDimension);

    // console.log('render gantt');

    let gridHierColumn = stateProps.hierColumnWidth;
    let gridActColumns = "auto";
    let gridDateColumn = `minmax(${stateProps.minDateColumnWidth}, auto)`;
    // let gridDateColumn = `1fr`;
    let mainGridColumns = `${gridHierColumn} 5px ${gridActColumns}`;

    let topPanelProps = {
        zoomIn: stateHandlers.zoomIn,
        zoomOut: stateHandlers.zoomOut,
        reMeasure,
        extraData,
    };

    let headerRowProps = {
        dateRange,
        resolution,
        gridHierColumn,
        gridDateColumn,
        reMeasure,
        rtl,
        extraData,
        print,
        ganttTheme,
        editHier,
        setEditHier,
        saveHier,
        cancelHierEdit,
    };

    let ResourceHierarchyProps = {
        hierarchy: activeHier,
        dateRange,
        gridHierColumn,
        gridDateColumn,
        minDateColumnWidth: stateProps.minDateColumnWidth,
        activities,
        actPosData: {
            startDate,
            endDate,
            naturalStartOffset: stateProps.hierColumnWidth,
            gridDimension
        },
        extraData,
        rtl,
        reMeasure,
        gridRef,
        containerRef,
        hierDefaultOpen,
        print,
        ganttTheme,
        flatHierarchy: flattenHierarchy(activeHier),
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid gap={"0"} className={classes.outsideContainer} rows={"auto auto 1fr"} columns={"1fr"}>
                {
                    !print && <TopPanel {...topPanelProps} />
                }
                <Grid id="hiddenCloneForAnimations" ref={gridRef} style={{ visibility: 'hidden', height: '0' }} gap={'0'} columns={mainGridColumns} rows={"auto 1fr"}>
                    <HeaderRow {...headerRowProps} />
                </Grid>
                <Grid ref={mainGridRef} className={classes.mainGrid} gap={'0'} columns={mainGridColumns} rows={"auto auto 1fr"} areas={["headerRow headerRow headerRow", "gantt gantt gantt"]}>
                    <Cell area="headerRow" className={classes.headerRowCell}>
                        <HeaderRow {...headerRowProps} />
                    </Cell>
                    <Cell area="gantt">
                        <ResourceHierarchy {...ResourceHierarchyProps} />
                    </Cell>
                    <Cell className={classes.resizeHandler} left="2" top="2" height={1} onDragStart={dragStart} onDragEnd={dragEnd} draggable="true">
                    </Cell>
                    <Cell className={classes.hierarchyShadow} left="2" top="2" height={1}>
                    </Cell>
                    {
                        print ? null :
                            (
                                <Cell top={"2"} left={"1"} className={classes.hierarchyEditCell}>
                                    <HierarchySelector fullHier={hierarchy} rtl={rtl} setCurrentHier={setTempHier} />
                                </Cell>
                            )
                    }
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default Gantt;