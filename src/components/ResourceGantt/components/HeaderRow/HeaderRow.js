import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';

import classNames from 'classnames';
// import { diffInDays, getDateRange } from './../../../../utils/dateUtils';

import { Grid, Cell } from "styled-css-grid";

const useStyles = makeStyles(theme => ({
    headerDateGrid: {
        // background: 'white',
        // transition: 'inherit',
        // '& :nth-child(1)': {
        // },
        background: ({ ganttTheme: { headerRowBackground } }) => headerRowBackground,
        color: ({ ganttTheme: { headerRowColor } }) => headerRowColor,
        boxShadow: '0px 3px 12px 0px black',
    },
    headerDateCell: {
        height: 'auto',
        display: 'grid',
        borderLeft: ({ rtl, ganttTheme: { border } }) => rtl ? null : border,
        borderRight: ({ rtl, ganttTheme: { border } }) => rtl ? border : null,
        borderBottom: ({ ganttTheme: { border } }) => border,
        justifyContent: ({ print }) => print ? 'center' : null,
        alignContent: 'center',
        '& :hover': {
            // backgroundColor: 'grey',
            // transition: 'none',
        },
    },
    firstHeaderDateRowCell: {
        borderLeft: ({ rtl }) => rtl ? null : 'none',
        borderRight: ({ rtl }) => rtl ? 'none' : null,
    },
    lastHeaderDateRowCell: {
        borderRight: ({ rtl, ganttTheme: { border } }) => rtl ? null : border,
        borderLeft: ({ rtl, ganttTheme: { border } }) => rtl ? border : null,
    },
    firstHeaderDateRow: {
        borderTop: ({ ganttTheme: { border } }) => border,
    },
    lastHeaderDateRow: {
        justifyContent: 'center',
    },
    overlayTitle: {
        height: 'auto',
        position: ({ print }) => print ? null : 'sticky',
        left: ({ rtl }) => rtl ? null : '0',
        right: ({ rtl }) => rtl ? '0' : null,
        zIndex: '1',
        borderBottom: ({ ganttTheme: { border } }) => border,
        borderLeft: ({ ganttTheme: { border } }) => border,
        borderTop: ({ ganttTheme: { border } }) => border,
        borderRight: ({ ganttTheme: { border } }) => border,
        background: ({ ganttTheme: { headerRowBackground } }) => headerRowBackground,
        color: ({ ganttTheme: { headerRowColor } }) => headerRowColor,
    },
    hierEdit: {
        display: 'grid',
        justifyContent: 'center',
    },
    dateText: {
        position: ({ print }) => print ? null : 'sticky',
        left: ({ rtl }) => rtl ? null : '50%',
        right: ({ rtl }) => rtl ? '50%' : null,
        width: 'min-content'
    },
}));

const HeaderRow = ({ dateRange, resolution, gridDateColumn, gridHierColumn, reMeasure, rtl, extraData, print, ganttTheme, editHier, setEditHier }) => {
    let classes = useStyles({ rtl, print, ganttTheme });

    dateRange = dateRange.map((d) => ({
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        date: d.getUTCDate(),
        // hour: d.getUTCHours(),
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
            <Grid className={classes.headerDateGrid} gap={'0'} columns={`${gridHierColumn} repeat(${dateRange.length}, ${gridDateColumn})`} rows={`repeat(${Object.keys(dateRange[0]).length}, minmax(2em, 2em))`}>
                <Cell className={classes.overlayTitle} height={Object.keys(dateRange[0]).length} top={1} left={1} width={1}>
                    {
                        print ? null : (
                            <Grid gap={'0'} style={{ height: '100%' }} columns={'auto 1fr auto'} rows={'1fr auto'} areas={['. . .', 'edit . cancel']}>
                                <Cell onClick={() => setEditHier(!editHier)} area="edit">
                                    {
                                        editHier ?
                                            <SaveIcon /> : <EditIcon />
                                    }
                                </Cell>
                                <Cell area="cancel">
                                    {
                                        editHier ? <ClearIcon /> : null
                                    }
                                </Cell>
                            </Grid>
                        )
                    }
                </Cell>
                {
                    dateCellsValues.map((dcv, idx) => {
                        let cellStart = 0;
                        return (
                            dcv.map((v, idx2) => {
                                let cellClasses = classNames(
                                    classes.headerDateCell,
                                    idx > 1 ? classes.lastHeaderDateRow : null,
                                    idx2 === 0 ? classes.firstHeaderDateRowCell : null,
                                    idx === 0 ? classes.firstHeaderDateRow : null,
                                    idx2 === dcv.length - 1 ? classes.lastHeaderDateRowCell : null,
                                );
                                let cell = (
                                    <Cell className={cellClasses} key={idx2} left={cellStart + 2} top={idx + 1} width={v.num}>
                                        <div className={classNames(idx < 2 ? classes.dateText : null)}>
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