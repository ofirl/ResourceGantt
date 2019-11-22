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
}))

const ResourceGantt = ({ hierarchy = [], activities = [], startDate = "", endDate = "", resolution, categoryColorMap, stateProps, rtl }) => {
    const [gridRef, gridDimension] = useDimensions();
    let classes = useStyles();

    startDate = new Date(Date.parse(startDate));
    endDate = new Date(Date.parse(endDate));

    if (!resolution)
        resolution = diffInDays(startDate, endDate) > 2 ? 'days' : 'hours';

    let dateRange = getDateRange({ startDate, endDate })
        .map((d) => ({
            year: d.getUTCFullYear(),
            month: d.getUTCMonth() + 1,
            date: d.getUTCDate(),
        }));

    let gridHierColumn = stateProps.hierColumnWidth;
    // let gridActColumn = "minmax(500px, auto)";
    let gridActColumns = "auto";
    let gridDateColumn = 'minmax(20px, 100px)';

    let headerRowProps = {
        dateRange,
        resolution,
        gridHierColumn,
        gridDateColumn,
        // startDate: new Date(Date.parse(startDate)),
        // endDate: new Date(Date.parse(endDate))
    };

    let ResourceHierarchyProps = {
        hierarchy: hierarchy,
        rowCellsNum: dateRange.length,
        gridHierColumn,
        gridDateColumn,
        activities,
        actPosData: {
            startDate,
            endDate,
            naturalStartOffset: stateProps.hierColumnWidth,
            gridDimension
        },
        categoryColorMap,
        rtl
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid className={classes.outsideContainer} rows={"auto 1fr"} columns={"1fr"}>
                <TopPanel />
                <div className={classes.ganttContainer}>
                    {/* <div> */}
                        <Grid ref={gridRef} gap={'0'} columns={`${gridHierColumn} ${gridActColumns}`} rows={"auto auto 1fr"} areas={["top top", "headerRow headerRow", "gantt gantt"]}>
                            <Cell area="top">
                                {/* <TopPanel /> */}
                            </Cell>
                            <Cell area="headerRow">
                                <HeaderRow {...headerRowProps} />
                            </Cell>
                            {/* <Cell className={classes.overlay} top={2} left={1} width={1} height={1}>

                            </Cell> */}
                            <Cell area="gantt">
                                <ResourceHierarchy {...ResourceHierarchyProps} />
                            </Cell>
                        </Grid>
                    {/* </div> */}
                </div>
            </Grid>
        </ThemeProvider>
    );
};

export default ResourceGantt;