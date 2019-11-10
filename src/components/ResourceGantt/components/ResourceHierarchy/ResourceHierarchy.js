import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    hierarchyNode: {
        paddingLeft: theme.spacing(1)
    }
}))

const HierarchyNode = ({ name, children, level }) => {
    const [open, setOpen] = useState(false);

    const classes = useStyles();

    return (
        <div className={`${classes.hierarchyNode} pointer`}>
            <div onClick={() => setOpen(!open)}>
                {
                    children ? (
                        open ? (<ArrowDropDownIcon />) : (<ArrowRightIcon />)
                    ) : null
                }
                <Typography variant="subtitle2" style={{display: 'inline'}}>
                    {name}
                </Typography>
            </div>
            {
                children && open ?
                    children.map((node) =>
                        <HierarchyNode {...node} level={level + 1} />
                    )
                    : null
            }
        </div>
    );
};

const ResourceHierarchy = ({ hierarchy }) => {
    return (
        <div>
            ResourceHierarchy
            {
                hierarchy.map((root) =>
                    <HierarchyNode {...root} level={0} />
                )
            }
        </div>
    );
};

export default ResourceHierarchy;