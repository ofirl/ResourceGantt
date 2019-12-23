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
        backgroundColor: 'white',
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
                            checked={node.nodeIndeterminate ? null : checked}
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

const HierarchySelector = ({ rtl, fullHier, currentHier, setCurrentHier }) => {
    const [checkedNodes, setCheckedNodes] = useState([]);
    const [expandedNodes, setExpandedNodes] = useState([]);

    const classes = useStyles({ rtl, level: 0 });

    let currentFlatHier = flattenHierarchy(currentHier, true);
    let fullFlatHier = flattenHierarchy(fullHier, true);

    const checkChildrenState = (node) => {
        let { children } = node;

        if (children == null)
            return;

        children.forEach((c) => {
            checkChildrenState(c);
        });

        node.nodeIndeterminate = false;
        if (children.every((c) => c.nodeChecked)) {
            if (!node.nodeChecked)
                handleCheck(node);

        }
        else if (!children.some((c) => c.nodeChecked)) {
            if (node.nodeChecked)
                handleCheck(node);
        }
        else {
            node.nodeIndeterminate = true;
            if (node.nodeChecked)
                handleCheck(node, false);
            // node.nodeChecked = false;
        }
    };

    const handleCheck = (node, updateChildren = true) => {
        node.nodeChecked = !node.nodeChecked;

        let nodeIdx = checkedNodes.findIndex((n) => n === node.id);
        if (nodeIdx === -1) {
            let newCheckedNodes = [...checkedNodes, node.id];
            let nodeHier = flattenHierarchy([node], true);
            nodeHier.splice(0, 1);
            if (updateChildren) {
                nodeHier.forEach((n) => {
                    n.nodeChecked = true;
                    if (!newCheckedNodes.includes(n.id))
                        newCheckedNodes.push(n.id);
                });
            }
            setCheckedNodes(newCheckedNodes);
        }
        else {
            let newCheckedNodes = [...checkedNodes];
            newCheckedNodes.splice(nodeIdx, 1);
            let nodeHier = flattenHierarchy([node], true);
            nodeHier.splice(0, 1);
            if (updateChildren) {
                nodeHier.forEach((n) => {
                    n.nodeChecked = false;
                    if (newCheckedNodes.includes(n.id))
                        newCheckedNodes.splice(newCheckedNodes.findIndex((cn) => cn === n.id), 1);
                });
            }
            setCheckedNodes(newCheckedNodes);
        }

        const buildHier = (node) => {
            if (node.nodeChecked)
                return [node];

            if (node.children == null)
                return [];

            let hier = [];

            node.children.forEach((n) => {
                if (n.nodeChecked)
                    return hier.push(n);

                hier.push(...buildHier(n));
            });

            return hier;
        };

        setCurrentHier(fullHier.reduce((prev, curr) => {
            let temp = buildHier(curr);
            if (temp.length > 0)
                prev.push(...temp);

            return prev;
        }, []));
    };

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
        if (hn.nodeChecked == null)
            hn.nodeChecked = currentFlatHier.find((n) => n.id === hn.id) != null;
        if (hn.nodeExpanded == null)
            hn.nodeExpanded = false;
    });

    fullHier.forEach((n) => {
        checkChildrenState(n);
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