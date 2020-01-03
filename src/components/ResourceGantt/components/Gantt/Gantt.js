import React, { Fragment, useRef, useState, useEffect, useCallback } from 'react';
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
        position: 'relative',
        height: '100%',
        width: 'max-content',
        minWidth: '100%',
        right: ({ print }) => print ? '0%' : null,
    },
    ganttContainer: {
        overflow: ({ print }) => print ? 'visible' : 'scroll',
        width: '100%',
    },
    headerRowCell: {
        position: ({ print }) => print ? null : 'sticky',
        top: '0',
        zIndex: '3',
    },
    resizeHandler: {
        position: 'sticky',
        left: ({ rtl, gridHierColumn }) => rtl ? null : gridHierColumn,
        right: ({ rtl, gridHierColumn }) => rtl ? gridHierColumn : null,
        zIndex: '3',
        cursor: 'col-resize',
        transform: ({ rtl }) => `translateX(${rtl ? '' : '-'}6px)`,
    },
    hierarchyShadow: {
        position: 'sticky',
        left: ({ rtl, gridHierColumn }) => rtl ? null : gridHierColumn,
        right: ({ rtl, gridHierColumn }) => rtl ? gridHierColumn : null,
        zIndex: '1',
        boxShadow: '-2px 0px 8px 0px black',
        transform: ({ rtl }) => `translateX(${rtl ? '' : '-'}6px)`,
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
}))

const Gantt = ({ hierarchy = [], activities = [], startDate, endDate, setStartDate, setEndDate, dateRange, resolution, rtl, stateProps, stateHandlers, extraData, 
    hierDefaultOpen, print, scrollPosHandler, ganttTheme, flatHierarchy, activeHier, setActiveHier, printable, onPrintClick, filter }) => {
    let [editHier, setEditHier] = useState(false);
    let [tempHier, setTempHier] = useState(activeHier);
    let [individualHierMode, setIndividualHierMode] = useState(false);
    let [individualHierModeChanged, setIndividualHierModeChanged] = useState(false);
    const [gridRef, gridDimension, reMeasure] = useDimensions();
    let containerRef = useRef();
    let mainGridRef = useRef();
    let scrollPos = useRef(0);
    let dragObj = useRef({});

    // console.log(stateProps.hierColumnWidth);
    // if (stateProps.hierColumnWidth != null)
    //     console.log(parseInt(stateProps.hierColumnWidth.substring(0, stateProps.hierColumnWidth.length - 2)));

    let classes = useStyles({ print, rtl, gridHierColumn: stateProps.hierColumnWidth, ganttTheme, dragging: dragObj.current.dragging, editHier });

    let saveScrollPos = () => {
        scrollPos.current = containerRef.current.scrollLeft / (gridDimension.scrollWidth - gridDimension.width);

        // console.log((gridDimension.scrollWidth - gridDimension.width));
        // console.log('scroll saved! ' + scrollPos.current);
    };

    // TODO: something is wrong here!!!!!!
    let setScrollPos = () => {
        // console.log((gridDimension.scrollWidth - gridDimension.width));
        // console.log(Math.round((gridDimension.scrollWidth - gridDimension.width) * scrollPos.current));

        containerRef.current.scrollTo(Math.round((gridDimension.scrollWidth - gridDimension.width) * scrollPos.current), containerRef.current.scrollTop);

        // console.log('scroll set!');
    };

    scrollPosHandler.current = {
        saveScrollPos,
        setScrollPos,
    };

    const updateDragWidth = () => {
        let newHierCoulmnWidth = dragObj.current.startDragPos - dragObj.current.currentDragPos;
        newHierCoulmnWidth = rtl ? newHierCoulmnWidth : -newHierCoulmnWidth;
        stateProps.changeHierColumnWidth(newHierCoulmnWidth);
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
        setIndividualHierModeChanged(false);
    };

    const cancelHierEdit = () => {
        setEditHier(false);
        setTempHier(activeHier);
        if (individualHierModeChanged) {
            setIndividualHierModeChanged(!individualHierModeChanged);
        }
    };

    const checkChildrenState = (node) => {
        let { children } = node;

        if (children == null)
            return;

        children.forEach((c) => {
            checkChildrenState(c);
        });

        node.nodeIndeterminate = false;
        if (children.every((c) => c.nodeChecked)) {
            node.nodeChecked = true;

        }
        else if (!children.some((c) => c.nodeChecked)) {
            node.nodeChecked = false;
        }
        else {
            node.nodeIndeterminate = true;
            node.nodeChecked = false;
        }
    };

    const buildHier = (node) => {
        let buildedHier = [];

        if (node.nodeChecked) {
            if (individualHierMode)
                buildedHier.push({ ...node, children: null });
            else
                return [node];
        }

        if (node.children == null)
            return buildedHier;

        node.children.forEach((n) => {
            buildedHier.push(...buildHier(n));
        });

        return buildedHier;
    };

    const updateTempHier = (test) => {
        setTempHier(hierarchy.reduce((prev, curr) => {
            let temp = buildHier(curr);
            if (temp.length > 0)
                prev.push(...temp);

            return prev;
        }, []));
    };

    useEffect(() => {
        updateTempHier();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [individualHierMode])

    const handleCheck = (node) => {
        node.nodeChecked = !node.nodeChecked;

        if (!individualHierMode) {
            let nodeHier = flattenHierarchy([node], true);
            nodeHier.splice(0, 1);
            nodeHier.forEach((n) => {
                n.nodeChecked = node.nodeChecked;
            });

            hierarchy.forEach((n) => {
                checkChildrenState(n);
            });
        }

        updateTempHier();
    };

    const handleHierModeSwitch = (newMode) => {
        // console.log("switch to : " + newMode);
        setIndividualHierMode(newMode);
        setIndividualHierModeChanged(true);
    };

    let gridHierColumn = stateProps.hierColumnWidth;
    let gridActColumns = "auto";
    let gridDateColumn = `minmax(${stateProps.minDateColumnWidth}, auto)`;
    // let gridDateColumn = `1fr`;
    let mainGridColumns = `${gridHierColumn} 5px ${gridActColumns}`;

    let minHeaderWidthPixels = parseInt(gridHierColumn.substring(0, gridHierColumn.length)) + parseInt(stateProps.minDateColumnWidth.substring(0, stateProps.minDateColumnWidth.length - 2)) * dateRange.length;
    let minHeaderWidth = `calc(${Math.max(minHeaderWidthPixels ,gridDimension.width) + 'px'})`;

    let topPanelProps = {
        zoomIn: stateHandlers.zoomIn,
        zoomOut: stateHandlers.zoomOut,
        reMeasure,
        extraData,
        print,
        printable,
        onPrintClick,
        rtl,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        filter,
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
        individualHierMode,
        setIndividualHierMode: handleHierModeSwitch,
        // TODO: test it.....
        minWidth: minHeaderWidth,
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
                    <TopPanel {...topPanelProps} />
                }
                <Grid id="hiddenCloneForAnimations" ref={gridRef} style={{ visibility: 'hidden', height: '0' }} gap={'0'} columns={mainGridColumns} rows={"auto 1fr"}>
                    <HeaderRow {...headerRowProps} />
                </Grid>
                <Grid ref={containerRef} gap="0" rows="1fr" columns="1fr" className={classes.ganttContainer}>
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
                                        <HierarchySelector fullHier={hierarchy} rtl={rtl} currentHier={tempHier} handleCheck={handleCheck} resolution={resolution} show={editHier} />
                                    </Cell>
                                )
                        }
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default Gantt;