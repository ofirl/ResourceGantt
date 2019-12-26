import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import Switch from '@material-ui/core/Switch';

import classNames from 'classnames';
// import { diffInDays, getDateRange } from './../../../../utils/dateUtils';

import { Grid, Cell } from "styled-css-grid";
// import Toggle from 'react-toggle';

import "react-toggle/style.css"
import Toggle from './../../../Toggle/Toggle';

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
    hierModeToggleCell: {
        display: 'grid',
        justifyContent: 'center',
        alignContent: 'end',
    },
    hierModeToggle: {
        display: 'flex',
        justifyContent: 'center',
    },
    dateText: {
        position: ({ print }) => print ? null : 'sticky',
        left: ({ rtl }) => rtl ? null : '50%',
        right: ({ rtl }) => rtl ? '50%' : null,
        width: 'min-content'
    },
}));

const resToKeyNum = [1, 2, 3, 4, 4, 5, 5, 5];

const HeaderRow = ({ dateRange, resolution, gridDateColumn, gridHierColumn, reMeasure, rtl, extraData, print, ganttTheme, editHier, setEditHier,
    saveHier, cancelHierEdit, individualHierMode, setIndividualHierMode }) => {
    let classes = useStyles({ rtl, print, ganttTheme });

    dateRange = dateRange.map((d) => {
        let keyNum = resToKeyNum[resolution];
        let dr = {};

        dr.year = d.getUTCFullYear();
        if (keyNum >= 2)
            dr.month = d.getUTCMonth() + 1;
        if (keyNum >= 3)
            dr.date = d.getUTCDate();
        if (keyNum >= 4)
            dr.hour = d.getUTCHours();
        if (keyNum >= 5)
            dr.minute = d.getUTCMinutes();

        return dr;
        // return {
        //     year: d.getUTCFullYear(),
        //     month: d.getUTCMonth() + 1,
        //     date: d.getUTCDate(),
        //     hour: d.getUTCHours(),
        //     minute: d.getUTCMinutes(),
        // };
    });



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
                            <Grid gap={'0'} style={{ height: '100%' }} columns={'auto 1fr auto 1fr auto'} rows={'1fr auto'} areas={['. . . . .', 'edit . hierModeSwitch . cancel']}>
                                <Cell area="edit">
                                    {
                                        editHier ?
                                            <SaveIcon onClick={saveHier} /> : <EditIcon onClick={() => setEditHier(true)} />
                                    }
                                </Cell>
                                <Cell area="hierModeSwitch">
                                    {
                                        editHier ?
                                            (
                                                <div className={classes.hierModeToggleCell}>
                                                    <div className={classes.hierModeToggle}>
                                                        <Toggle
                                                            // defaultChecked={individualHierMode}
                                                            checked={individualHierMode}
                                                            style={{ transition: 'all ease 0.5s' }}
                                                            onChange={() => setIndividualHierMode(!individualHierMode)}>
                                                            Individual Mode
                                                            </Toggle>
                                                    </div>
                                                </div>
                                            ) : null
                                    }
                                </Cell>
                                <Cell area="cancel">
                                    {
                                        editHier ? <ClearIcon onClick={cancelHierEdit} /> : null
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