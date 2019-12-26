import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Cell } from 'styled-css-grid';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
    tooltip: {
        backgroundColor: '#dae9ff',
        borderRadius: '0.5em',
        // padding: theme.spacing(2),
        direction: ({ rtl }) => rtl ? 'rtl' : null,
        width: '100%',
        position: 'relative',
        boxShadow: '0px 0px 15px 0px #555'
    },
    contentCell: {
        padding: theme.spacing(1),
    },
    tooltipHeaderCell: {
        backgroundColor: '#21304d',
        color: 'white',
        display: 'grid',
        alignContent: 'center',
    },
    tooltipHeaderLeft: {
        borderRadius: '0.5em 0 0 0',
        // padding: theme.spacing(1),
        paddingLeft: ({ rtl }) => rtl ? theme.spacing(1) : null,
        paddingRight: ({ rtl }) => rtl ? null : theme.spacing(1),
    },
    tooltipHeaderRight: {
        borderRadius: '0 0.5em 0 0',
        paddingRight: ({ rtl }) => rtl ? theme.spacing(1) : null,
        paddingLeft: ({ rtl }) => rtl ? null : theme.spacing(1),
    },
    tooltipHeaderSpacer: {

    },
}));

const ActivityTooltip = ({ rtl, act, flatHierarchy }) => {
    const classes = useStyles({ rtl });

    return (
        <Grid gap={"0"} className={classes.tooltip} rows={'2em auto'} columns={'1fr auto 1fr'} areas={['name titleSpacer id', 'content content content']}>
            <Cell area="name" className={classNames(classes.tooltipHeaderCell, classes.tooltipHeaderRight)}>
                <div style={{ display: 'grid', justifyContent: 'right' }}>
                    {act.name}
                </div>
            </Cell>
            <Cell area="titleSpacer" className={classNames(classes.tooltipHeaderCell, classes.tooltipHeaderSpacer)}>

            </Cell>
            <Cell area="id" style={{ justifyContent: 'end' }} className={classNames(classes.tooltipHeaderCell, classes.tooltipHeaderLeft)}>
                <div style={{ display: 'grid', justifyContent: 'left' }}>
                    {act.id}
                </div>
            </Cell>
            <Cell area="content" className={classes.contentCell}>
                <Grid columns={'1fr auto 1fr'} rows={'repeat(2, auto)'} areas={['category . .', 'startTime timesSpacer endTime', 'resources resources resources']}>
                    <Cell area="category">
                        {act.category}
                    </Cell>
                    <Cell area="startTime">
                        {act.originalStartTime.toLocaleString()}
                    </Cell>
                    <Cell area="timesSpacer" style={{ justifyContent: 'center', display: 'grid' }}>
                        -
                    </Cell>
                    <Cell area="endTime">
                        {act.originalEndTime.toLocaleString()}
                    </Cell>
                    <Cell area="resources">
                        {act.resource.map((r) => flatHierarchy.find((n) => n.id === r)).map((r) => r.name).join(' ,')}
                    </Cell>
                </Grid>
            </Cell>
        </Grid>
    );
};

export default ActivityTooltip;