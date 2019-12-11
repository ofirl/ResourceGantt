import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import { Typography } from '@material-ui/core';

import { Grid, Cell } from 'styled-css-grid';

import Activity from '../Activity';
import classNames from 'classnames';

import GridCell from './components/GridCell/GridCell';

const useStyles = makeStyles(theme => ({
    hierGrid: {
        '& .hier-grid-row:nth-child(1)': {
            '& .inner-grid-cell': {
                borderTop: 'none',
            },
            '& .hier-node:nth-child(1)': {
                // borderTop: '1px solid black',
                borderTop: 'none',
            },
        },
        '& .hier-grid-row:last-child': {
            borderBottom: '1px solid black',
            '& > div': {

            },
        },
    },
    hierarchyNodeRow: {
        transition: 'inherit',
        position: 'relative',
        '& .inner-grid-cell': {
            borderLeft: ({ rtl }) => rtl ? null : '1px solid black',
            borderRight: ({ rtl }) => rtl ? '1px solid black' : null,
            borderTop: '1px solid black',
        },
        '& .inner-grid-cell:nth-child(2)': {
            borderLeft: ({ rtl }) => rtl ? null : 'none',
            borderRight: ({ rtl }) => rtl ? 'none' : null,
        },
        '& .last-inner-grid-cell': {
            borderRight: ({ rtl }) => rtl ? null : '1px solid black',
            borderLeft: ({ rtl }) => rtl ? '1px solid black' : null,
        }
    },
    hierarchyNodeCell: {
        position: ({ print }) => print ? null : 'sticky',
        left: ({ rtl }) => rtl ? null : '0',
        right: ({ rtl }) => rtl ? '0' : null,
        background: 'white',
        height: ({ actCol = 0 }) => `calc(1.75em + (1.5em * ${actCol}))`,
        borderTop: '1px solid black',
        borderLeft: '1px solid black',
        borderRight: '1px solid black',
        zIndex: '1',
    },
    hierarchyNode: {
        paddingLeft: ({ level = 0, rtl }) => rtl ? null : theme.spacing(level) * 4,
        paddingRight: ({ level = 0, rtl }) => rtl ? theme.spacing(level) * 4 : null,
        position: ({ print }) => print ? null : 'sticky',
        top: '50%',
        overflow: 'hidden',
    },
}))

const SingleHierNode = ({ name, children, level, classes, open, setOpen, rtl }) => {
    return (
        <Cell className={classNames(classes.hierarchyNodeCell, "hier-node")}>
            <Grid columns="20% 80%" rows="1fr" className={`${classes.hierarchyNode} pointer`} onClick={() => setOpen(!open)}>
                {
                    children ? (
                        open ? (<ArrowDropDownIcon />) : rtl ? (<ArrowLeftIcon />) : (<ArrowRightIcon />)
                    ) : <div></div>
                }
                <Typography variant="subtitle2" style={{ display: 'inline' }}>
                    {name}
                </Typography>
            </Grid>
        </Cell>
    );
};

const HierarchyNode = ({ id: nodeId, name, children, level, dateRange, gridHierColumn, gridDateColumn, activities, actPosData, extraData, rtl, reMeasure, containerRef, hierDefaultOpen = false, print }) => {
    const [open, setOpen] = useState(hierDefaultOpen);

    let resourceActs = activities.filter((act) => act.resource.includes(nodeId));
    let actElements = resourceActs.map((act) =>
        <Activity key={act.id} act={act} actPosData={actPosData} resource={nodeId} rtl={rtl} containerRef={containerRef} extraData={extraData} />
    );

    const classes = useStyles({ print, rtl, level, actCol: resourceActs.length > 0 ? Math.max(...resourceActs.map((a) => a.level[nodeId])) : 0 });

    let singleNodeProps = {
        name,
        children,
        level,
        classes,
        open,
        setOpen,
        rtl
    };

    let hierNodeProps = {
        dateRange,
        level: level + 1,
        gridHierColumn,
        gridDateColumn,
        activities,
        actPosData,
        extraData,
        rtl,
        reMeasure,
        containerRef,
        hierDefaultOpen,
        print,
    };

    let createRowCells = (dateRange) => {
        let cells = [];

        cells.push(...dateRange.map((date, i) =>
            <GridCell key={i} date={date} resource={nodeId} lastInRow={i === dateRange.length - 1} />
        ));

        return cells;
    };

    let node = (
        <Grid key={nodeId} className={classNames(classes.hierarchyNodeRow, "hier-grid-row")}
            gap={'0'} columns={`${gridHierColumn} repeat(${dateRange.length}, ${gridDateColumn})`}>
            <SingleHierNode {...singleNodeProps} />
            {
                createRowCells(dateRange)
            }
            {
                actElements
            }
        </Grid>
    );

    let childNodes = children && open ?
        children.map((node) =>
            <HierarchyNode key={node.id} {...node} {...hierNodeProps} />
        )
        : null;

    return childNodes ? [node, ...childNodes] : node;
};

const ResourceHierarchy = ({ hierarchy, dateRange, gridHierColumn, gridDateColumn, minDateColumnWidth, activities, actPosData, extraData, rtl, reMeasure, containerRef, hierDefaultOpen, print }) => {
    let classes = useStyles();

    let nodeProps = {
        dateRange,
        level: 0,
        gridHierColumn,
        gridDateColumn,
        activities,
        actPosData,
        extraData,
        rtl,
        reMeasure,
        containerRef,
        hierDefaultOpen,
        print
    };

    return (
        <Grid className={classes.hierGrid} columns={`auto`} gap={'0'}>
            {
                hierarchy.map((root) =>
                    <HierarchyNode key={root.id} {...root} {...nodeProps} />
                )
            }
        </Grid>
    );
};

export default ResourceHierarchy;