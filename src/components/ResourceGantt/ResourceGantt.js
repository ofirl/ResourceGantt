import React, { Fragment } from 'react';
import TopPanel from './components/TopPanel';
import { ThemeProvider } from '@material-ui/core/styles';

import { Grid, Cell } from "styled-css-grid";
import ResourceHierarchy from './components/ResourceHierarchy';

import defaultTheme from './defaultTheme';
import HeaderRow from './components/HeaderRow';
import { diffInDays, getDateRange } from './../../utils/dateUtils';

import { makeStyles } from '@material-ui/core/styles';
import useDimensions from '../../customHooks/useDimensions/useDimensions';

const useStyles = makeStyles(theme => ({
    outsideContainer: {
        height: '100%'
    },
    ganttContainer: {
        overflow: 'scroll',
        position: 'relative',
        height: '100%',
        width: '100%',
    },
    mainGrid: {
        transition: 'ease 1s',
        '& *': {
            transition: 'inherit',
        },
    },
}))

const ResourceGantt = ({ hierarchy = [], activities = [], startDate = "", endDate = "", resolution, categoryColorMap, rtl, stateProps, stateHandlers }) => {
    const [gridRef, gridDimension, reMeasure] = useDimensions();
    let classes = useStyles();

    // console.log(gridDimension);

    startDate = new Date(Date.parse(startDate));
    endDate = new Date(Date.parse(endDate));

    if (!resolution)
        resolution = diffInDays(startDate, endDate) > 2 ? 'days' : 'hours';

    let dateRange = getDateRange({ startDate, endDate });

    let gridHierColumn = stateProps.hierColumnWidth;
    let gridActColumns = "auto";
    let gridDateColumn = `minmax(${stateProps.minDateColumnWidth}, auto)`;

    let topPanelProps = {
        zoomIn: stateHandlers.zoomIn,
        zoomOut: stateHandlers.zoomOut,
        reMeasure,
    };

    let headerRowProps = {
        dateRange,
        resolution,
        gridHierColumn,
        gridDateColumn,
        reMeasure,
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
        categoryColorMap,
        rtl,
        reMeasure,
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid className={classes.outsideContainer} rows={"auto 1fr"} columns={"1fr"}>
                <TopPanel {...topPanelProps} />
                <div className={classes.ganttContainer}>
                    <Grid id="hiddenCloneForAnimations" ref={gridRef} style={{ visibility: 'hidden', position: 'absolute' }} gap={'0'} columns={`${gridHierColumn} ${gridActColumns}`} rows={"auto 1fr"}>
                        <HeaderRow {...headerRowProps} />
                    </Grid>
                    <Grid className={classes.mainGrid} gap={'0'} columns={`${gridHierColumn} ${gridActColumns}`} rows={"auto 1fr"} areas={["headerRow headerRow", "gantt gantt"]}>
                        <Cell area="headerRow">
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

export default ResourceGantt;