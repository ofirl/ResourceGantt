import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { diffInDays, getDateRange } from './../../../../utils/dateUtils';

import { Grid, Cell } from "styled-css-grid";

const useStyles = makeStyles(theme => ({
    hierarchyNode: {
        paddingLeft: theme.spacing(1)
    }
}));

const HeaderRow = ({ dateRange, resolution }) => {
    return (
        <Grid gap={'0'} columns={`repeat(${dateRange.length}, minmax(50px, 100px))`} rows={`repeat(${Object.keys(dateRange[0]).length}, minmax(20px, 20px))`}>
            {
                dateRange.map((d, idx) => (
                    Object.keys(d).map((k, idx2) => (
                        <Cell key={idx2} left={idx + 1} top={idx2 + 1}>
                            {d[k]}
                        </Cell>
                    ))
                ))
            }
        </Grid>
    );

};

export default HeaderRow;