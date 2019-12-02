import React, { Fragment, useRef } from 'react';
import TopPanel from './../../components/TopPanel';
import { ThemeProvider } from '@material-ui/core/styles';

import { Grid, Cell } from "styled-css-grid";
import ResourceHierarchy from './../../components/ResourceHierarchy';

import defaultTheme from './../../defaultTheme';
import HeaderRow from './../../components/HeaderRow';
import { diffInDays, getDateRange } from './../../../../utils/dateUtils';

import { makeStyles } from '@material-ui/core/styles';
import useDimensions from './../../../../customHooks/useDimensions/useDimensions';

const useStyles = makeStyles(theme => ({
    outsideContainer: {
        height: '100%'
    },
    ganttContainer: {
        overflow: ({ print }) => print ? 'visible' : 'scroll',
        position: 'relative',
        height: '100%',
        width: ({ print }) => print ? '100%' : '100%',
        right: ({ print }) => print ? '0%' : null,
    },
    mainGrid: {
        transition: 'ease 1s',
        '& *': {
            transition: 'inherit',
        },
    },
    headerRowCell: {
        position: ({ print }) =>  print ? null : 'sticky',
        top: '0',
        zIndex: '2',
    },
}))

const Gantt = ({ hierarchy = [], activities = [], startDate, endDate, dateRange, resolution, rtl, stateProps, stateHandlers, extraData, hierDefaultOpen, print }) => {
    const [gridRef, gridDimension, reMeasure] = useDimensions();
    let containerRef = useRef();

    let classes = useStyles({ print });

    // console.log(gridDimension);

    let gridHierColumn = stateProps.hierColumnWidth;
    let gridActColumns = "auto";
    let gridDateColumn = `minmax(${stateProps.minDateColumnWidth}, auto)`;
    // let gridDateColumn = `1fr`;

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
    };

    let ResourceHierarchyProps = {
        hierarchy: hierarchy,
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
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid className={classes.outsideContainer} rows={"auto 1fr"} columns={"1fr"}>
                {
                    !print && <TopPanel {...topPanelProps} />
                }
                <div ref={containerRef} className={classes.ganttContainer}>
                    <Grid id="hiddenCloneForAnimations" ref={gridRef} style={{ visibility: 'hidden', height: '0' }} gap={'0'} columns={`${gridHierColumn} ${gridActColumns}`} rows={"auto 1fr"}>
                        <HeaderRow {...headerRowProps} />
                    </Grid>
                    <Grid className={classes.mainGrid} gap={'0'} columns={`${gridHierColumn} ${gridActColumns}`} rows={"auto 1fr"} areas={["headerRow headerRow", "gantt gantt"]}>
                        <Cell area="headerRow" className={classes.headerRowCell}>
                            <HeaderRow {...headerRowProps} />
                        </Cell>
                        <Cell area="gantt">
                            <ResourceHierarchy {...ResourceHierarchyProps} />
                        </Cell>
                    </Grid>
                </div>
            </Grid>
        </ThemeProvider>
    );
};

export default Gantt;