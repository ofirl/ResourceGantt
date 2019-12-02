import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import classNames from 'classnames';

import { Cell } from 'styled-css-grid';

const useStyles = makeStyles(theme => ({
    innerCell: {
        height: 'auto',
    },
    weekendCell: {
        background: '#bbb',
    },
}))

const GridCell = ({ date, lastInRow, resource }) => {
    let classes = useStyles();

    let cellClasses = classNames(
        classes.innerCell,
        "inner-grid-cell",
        lastInRow ? 'last-inner-grid-cell' : null,
        date.getUTCDay() > 4 ? classes.weekendCell : null,
    );

    return (
        <Cell key={date.getTime()} className={cellClasses}>

        </Cell>
    );
}

export default GridCell;