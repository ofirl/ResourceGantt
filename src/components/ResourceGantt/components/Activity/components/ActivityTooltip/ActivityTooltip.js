import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Cell } from 'styled-css-grid';

const useStyles = makeStyles(theme => ({
    tooltip: {
        backgroundColor: '#ddd',
        borderRadius: '0.5em',
        // padding: theme.spacing(2),
        direction: ({ rtl }) => rtl ? 'rtl' : null,
        width: '100%',
        position: 'relative',
    },
    tooltipHeaderLeft: {
        borderRadius: '0.5em 0 0 0',
        backgroundColor: '#999',
    },
    tooltipHeaderRight: {
        borderRadius: '0 0.5em 0 0',
        backgroundColor: '#999',
    },
    tooltipHeaderSpacer: {
        backgroundColor: '#999',
    },
}));

const ActivityTooltip = ({ rtl, act }) => {
    const classes = useStyles({ rtl });

    return (
        <Grid gap={"0"} className={classes.tooltip} rows={'auto auto auto'} columns={'1fr auto 1fr'} areas={['name titleSpacer id', 'category . .', 'startTime timesSpacer endTime']}>
            <Cell area="name" className={classes.tooltipHeaderRight}>
                <div style={{display: 'grid', justifyContent: 'right'}}>
                    {act.name}
                </div>
            </Cell>
            <Cell area="titleSpacer" className={classes.tooltipHeaderSpacer}>

            </Cell>
            <Cell area="id" style={{justifyContent: 'end'}} className={classes.tooltipHeaderLeft}>
                <div style={{display: 'grid', justifyContent: 'left'}}>
                    {act.id}
                </div>
            </Cell>
            <Cell area="category">
                {act.category}
            </Cell>
            <Cell area="startTime">
            {act.startTime.toLocaleString()}
            </Cell>
            <Cell area="timesSpacer" style={{justifyContent: 'center', display: 'grid'}}>
                -
            </Cell>
            <Cell area="endTime">
                {act.endTime.toLocaleString()}
            </Cell>
        </Grid>
    );
};

export default ActivityTooltip;