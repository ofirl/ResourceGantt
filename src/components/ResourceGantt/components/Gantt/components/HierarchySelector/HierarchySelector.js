import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';

import Checkbox from '@material-ui/core/Checkbox';
import { flattenHierarchy } from './../../../../../../utils/hierarchyUtils';

import CheckboxTree from 'react-checkbox-tree';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import { Grid, Cell } from 'styled-css-grid';

const useStyles = makeStyles(theme => ({
    hierarchyEdit: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        backgroundColor: '#dae9ff',
        position: 'sticky',
        //TODO: fix ugly later :)
        top: '6em',
    },
    checkboxRoot: {
        color: 'green',
        '&$checkboxChecked': {
            color: 'orange',
        },
    },
    checkboxChecked: {},
    hierarchyNode: {
        marginRight: ({ rtl, level }) => rtl ? theme.spacing(level) * 2 : null,
        marginLeft: ({ rtl, level }) => rtl ? null : theme.spacing(level) * 2,
        // borderRight: ({ level }) => level !== 1 ? '1px solid black' : null,
    },
    hierNodeExpander: {
        display: 'grid',
        justifyItems: 'center',
        alignItems: 'center',
    },
    spacer: {
        height: '0.5em',
    },
}));

const HierNode = ({ node, level, rtl, handleCheck, handleExpand, expanded, checked }) => {
    const classes = useStyles({ rtl, level });

    let { children } = node;

    let checkboxClasses = {
        root: classes.checkboxRoot,
        checked: classes.checkboxChecked,
    };

    const handleCheckChange = () => {
        handleCheck(node);
    };

    const handleExpandChange = () => {
        handleExpand(node);
    };

    let nodeHandlers = {
        handleCheck,
        handleExpand
    };

    return (
        <div>
            <Grid className={classes.hierarchyNode} gap="0" rows={"1fr"} columns={"auto 1fr"}>
                <Cell className={classes.hierNodeExpander}>
                    <span className={classes.hierNodeExpander} onClick={children ? handleExpandChange : null}>
                        {
                            expanded ?
                                (
                                    <ArrowDropDownIcon />
                                )
                                :
                                (
                                    rtl ?
                                        (
                                            <ArrowLeftIcon style={{ visibility: `${children ? 'visible' : 'hidden'}` }} />
                                        ) : <ArrowRightIcon style={{ visibility: `${children ? 'visible' : 'hidden'}` }} />
                                )
                        }
                    </span>
                </Cell>
                <Cell>
                    <div>
                        <Checkbox
                            checked={node.nodeIndeterminate ? false : checked}
                            indeterminate={node.nodeIndeterminate}
                            classes={checkboxClasses}
                            onChange={handleCheckChange}
                        />
                        {
                            node.name
                        }
                    </div>
                </Cell>
            </Grid>
            {
                expanded && node.children ? node.children.map((n) => <HierNode key={n.id} node={n} level={level + 1} rtl={rtl} {...nodeHandlers} checked={n.nodeChecked} expanded={n.nodeExpanded} />)
                    : null
            }
        </div>
    );
};

const HierarchySelector = ({ rtl, fullHier, currentHier, handleCheck, individualHierMode }) => {
    const [expandedNodes, setExpandedNodes] = useState([]);

    const classes = useStyles({ rtl, level: 0 });

    let currentFlatHier = flattenHierarchy(currentHier, true);
    let fullFlatHier = flattenHierarchy(fullHier, true);

    const handleExpand = (node) => {
        node.nodeExpanded = !node.nodeExpanded;

        let nodeIdx = expandedNodes.findIndex((n) => n === node.id);
        if (nodeIdx === -1) {
            let newExpandedNodes = [...expandedNodes, node.id];
            setExpandedNodes(newExpandedNodes);
        }
        else {
            let newExpandedNodes = [...expandedNodes];
            newExpandedNodes.splice(nodeIdx, 1)
            setExpandedNodes(newExpandedNodes);
        }
    };

    fullFlatHier.forEach((hn) => {
        hn.nodeChecked = currentFlatHier.find((n) => n.id === hn.id) != null;

        if (hn.nodeExpanded == null)
            hn.nodeExpanded = false;
    });

    let nodeHandlers = {
        handleCheck,
        handleExpand
    };

    return (
        <div className={classes.hierarchyEdit}>
            {
                fullHier.map((n) => <HierNode key={n.id} node={n} level={1} rtl={rtl} {...nodeHandlers} checked={n.nodeChecked} expanded={n.nodeExpanded} />)
            }
        </div>
    );
};

export default HierarchySelector;