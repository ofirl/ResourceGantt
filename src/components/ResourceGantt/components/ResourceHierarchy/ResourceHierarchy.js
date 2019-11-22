import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { Typography } from '@material-ui/core';

import { Grid, Cell } from 'styled-css-grid';

import Activity from '../Activity';

const useStyles = makeStyles(theme => ({
    hierarchyNodeRow: {
        position: 'relative',
    },
    hierarchyNodeCell: {
        position: 'sticky',
        left: '0',
        height: ({ actCol }) => `calc(1.75em + (1.5em * ${actCol}))`
    },
    hierarchyNode: {
        paddingLeft: ({ level }) => theme.spacing(level)
    },
    innerCell: {
        border: '1px solid black',
    },
}))

const SingleHierNode = ({ name, children, level, classes, open, setOpen }) => {
    return (
        <Cell className={classes.hierarchyNodeCell}>
            <div className={`${classes.hierarchyNode} pointer`}>
                <div onClick={() => setOpen(!open)}>
                    {
                        children ? (
                            open ? (<ArrowDropDownIcon />) : (<ArrowRightIcon />)
                        ) : null
                    }
                    <Typography variant="subtitle2" style={{ display: 'inline' }}>
                        {name}
                    </Typography>
                </div>
            </div>
        </Cell>
    );
};

const HierarchyNode = ({ id: nodeId, name, children, level, rowCellsNum, gridHierColumn, activities, actPosData, categoryColorMap, rtl }) => {
    const [open, setOpen] = useState(false);

    let resourceActs = activities.filter((act) => act.resource.includes(nodeId));
    let actElements = resourceActs.map((act) =>
        <Activity key={act.id} act={act} actPosData={actPosData} resource={nodeId} rtl={rtl} />
    );

    const classes = useStyles({ level, actCol: Math.max(...resourceActs.map((a) => a.level[nodeId])) });

    let singleNodeProps = {
        name,
        children,
        level,
        classes,
        open,
        setOpen
    };

    let hierNodeProps = {
        rowCellsNum,
        level: level + 1,
        gridHierColumn,
        activities,
        actPosData,
        categoryColorMap,
        rtl
    };

    let createRowCells = (rowCellsNum) => {
        let cells = [];

        for (let i = 0; i < rowCellsNum; i++)
            cells.push(<Cell className={classes.innerCell} key={i}>  </Cell>);

        return cells;
    };

    let node = (
        <Grid key={nodeId} className={classes.hierarchyNodeRow} gap={'0'} columns={`${gridHierColumn} repeat(${rowCellsNum}, minmax(50px, 100px))`}>
            <SingleHierNode {...singleNodeProps} />
            {
                createRowCells(rowCellsNum)
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

const ResourceHierarchy = ({ hierarchy, rowCellsNum, gridHierColumn, activities, actPosData, categoryColorMap, rtl }) => {
    let nodeProps = {
        rowCellsNum,
        level: 0,
        gridHierColumn,
        activities,
        actPosData,
        categoryColorMap,
        rtl
    };

    return (
        <Grid columns={"auto"} gap={'0'}>
            {
                hierarchy.map((root) =>
                    <HierarchyNode key={root.id} {...root} {...nodeProps} />
                )
            }
        </Grid>
    );
};

export default ResourceHierarchy;