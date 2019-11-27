import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { diffInDays, getDateRange } from './../../../../utils/dateUtils';

import { Grid, Cell } from "styled-css-grid";

const useStyles = makeStyles(theme => ({
    headerDateGrid: {
        background: 'white',
        transition: 'inherit',
        '& :nth-child(1)': {
        },
    },
    headerDateCell: {
        display: 'grid',
        borderLeft: '1px solid black',
        borderBottom: '1px solid black',
    },
    firstHeaderDateRowCell: {
        borderLeft: 'none',
    },
    lastHeaderDateRowCell: {
        borderRight: '1px solid black',
    },
    firstHeaderDateRow: {
        borderTop: '1px solid black',
    },
    lastHeaderDateRow: {
        justifyContent: 'center',
    },
    overlayTitle: {
        position: 'sticky',
        left: '0',
        background: 'white',
        zIndex: '1',
        borderBottom: '1px solid black',
        borderLeft: '1px solid black',
        borderTop: '1px solid black',
        borderRight: '1px solid black',
    },
    dateText: {
        position: 'sticky',
        left: '50%',
        width: 'min-content'
    },
}));

const HeaderRow = ({ dateRange, resolution, gridDateColumn, gridHierColumn, reMeasure }) => {
    let classes = useStyles();

    dateRange = dateRange.map((d) => ({
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        date: d.getUTCDate(),
    }));

    let dateKeysValues = Object.keys(dateRange[0]).map((k) => dateRange.map((d) => d[k]));
    let dateCellsValues = dateKeysValues.map((dkv) => {
        return dkv.reduce((acc, curr, ) => {
            if (acc.length === 0)
                acc.push({ value: curr, num: 1 });
            else if (acc[acc.length - 1].value === curr)
                acc[acc.length - 1].num++;
            else
                acc.push({ value: curr, num: 1 });

            return acc;
        }, [])
    });

    return (
        <Grid columns={"auto"}>
                <Grid className={classes.headerDateGrid} gap={'0'} columns={`${gridHierColumn} repeat(${dateRange.length}, ${gridDateColumn})`} rows={`repeat(${Object.keys(dateRange[0]).length}, minmax(20px, 20px))`}>
                    <Cell className={classes.overlayTitle} height={3} top={1} left={1} width={1}>
                        Hierarchy
                </Cell>
                    {
                        dateCellsValues.map((dcv, idx) => {
                            let cellStart = 0;
                            return (
                                dcv.map((v, idx2) => {
                                    let cellClasses = classNames(
                                        classes.headerDateCell,
                                        idx === dateCellsValues.length - 1 ? classes.lastHeaderDateRow : null,
                                        idx2 === 0 ? classes.firstHeaderDateRowCell : null,
                                        idx === 0 ? classes.firstHeaderDateRow : null,
                                        idx2 === dcv.length - 1 ? classes.lastHeaderDateRowCell : null,
                                    );
                                    let cell = (
                                        <Cell className={cellClasses} key={idx2} left={cellStart + 2} top={idx + 1} width={v.num}>
                                            <div className={classNames(idx !== dateCellsValues.length - 1 ? classes.dateText : null)}>
                                                {v.value}
                                            </div>
                                        </Cell>
                                    );
                                    cellStart += v.num;

                                    return cell;
                                })
                            );
                        })
                    }
                </Grid>
        </Grid>
    );

};

export default HeaderRow;