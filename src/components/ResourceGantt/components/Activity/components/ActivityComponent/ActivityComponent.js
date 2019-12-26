import React, { useState, useRef } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { Popper } from '@material-ui/core';
import classNames from 'classnames';
import { Grid, Cell } from 'styled-css-grid';

const useStyles = makeStyles(theme => ({
    actStyle: {
        background: ({ actBgColor = '#e6e66d' }) => actBgColor,
        borderRadius: '0.5em',
        boxShadow: '-2px 2px 8px 0px #999',
    },
    actNameCell: {
        position: 'sticky',
        right: '50%',
        width: '100%',
    },
    actNameWrapper: ({ print }) => print ? {
        display: 'grid',
        justifyContent: 'center',
    } : {},
    actName: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
}));

const ActivityComponent = ({ act, resource, extraData, print, gridHierColumn, rtl }) => {
    let { categoryColorMap } = extraData;

    const classes = useStyles({ actBgColor: categoryColorMap[act.category], gridHierColumn, rtl, print });

    return (
        <div className={classes.actStyle}>
            <Grid gap="0" rows="1fr" columns="auto 1fr auto" areas={["startCutSymbol actName endCutSymbol"]}>
                {
                    act.startTimeCut ?
                        (
                            <Cell area="startCutSymbol">
                                {rtl ? '<' : '>'}
                            </Cell>
                        ) : null
                }
                {
                    act.endTimeCut ?
                        (
                            <Cell area="endCutSymbol">
                                {rtl ? '>' : '<'}
                            </Cell>
                        ) : null
                }
                <Cell area="actName">
                    <Grid gap="0" rows="1fr" columns={print ? "1fr auto" : "auto 1fr"} areas={["content ."]}>
                        <Cell area="content" className={classes.actNameCell}>
                            <div className={classes.actNameWrapper}>
                                <div className={classes.actName}>
                                    {act.name}
                                </div>
                            </div>
                        </Cell>
                    </Grid>
                </Cell>
            </Grid>
        </div>
    );
};

export default ActivityComponent;