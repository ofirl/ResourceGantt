import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { diffInDays, getDateRange } from './../../../../utils/dateUtils';

import { Grid, Cell } from "styled-css-grid";

const useStyles = makeStyles(theme => ({
    headerDateCell: {
        display: 'grid',
        justifyContent: 'center',
        border: '1px solid black'
    },
    overlay: {
        position: 'sticky',
        left: '0',
        background: 'white',
        zIndex: '1',
    },
}));

const HeaderRow = ({ dateRange, resolution, gridDateColumn, gridHierColumn }) => {
    let classes = useStyles();

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
        <Grid>
            <Grid gap={'0'} columns={`${gridHierColumn} repeat(${dateRange.length}, ${gridDateColumn})`} rows={`repeat(${Object.keys(dateRange[0]).length}, minmax(20px, 20px))`}>
                <Cell className={classes.overlay} height={3} top={1} left={1} width={1}>
                    Hierarchy
                </Cell>
                {
                    dateCellsValues.map((dcv, idx) => {
                        let cellStart = 0;
                        return (
                            dcv.map((v, idx2) => {
                                let cell = (
                                    <Cell className={classes.headerDateCell} key={idx2} left={cellStart + 2} top={idx + 1} width={v.num}>
                                        {v.value}
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