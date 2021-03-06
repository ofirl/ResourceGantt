import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import PrintIcon from '@material-ui/icons/Print';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';

import { Grid, Cell } from 'styled-css-grid';

import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const useStyles = makeStyles(theme => ({
    topPanelGrid: {
        background: 'orange',
        // color: 'white',
        // '& *': {
        //     color: 'inherit',
        // },
    },
    backButtonContainer: {
        position: 'fixed',
        top: '2em',
        right: ({ rtl }) => rtl ? null : '2em',
        left: ({ rtl }) => rtl ? '2em' : null,
        zIndex: '4',
    },
    zoomCell: {
        display: 'grid',
        alignItems: 'center',
        gridTemplateColumns: 'auto auto',
    },
    printCell: {
        display: 'grid',
        alignItems: 'center',
    },
    dateCell: {
        display: 'grid',
        alignItems: 'center',
    },
    dateInputContainer: {
        height: '50%',
        '& .react-datepicker__input-container': {
            height: '100%',
        },
    },
    dateInputRoot: {
        height: '100%',
        direction: 'ltr',
        '& .MuiInputBase-root': {
            height: '100%',
        },
        '& .Mui-focused': {
            color: 'white',
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
        },
    },
    backButton: {
        background: 'orange',
        '&:hover': {
            background: '#bb7a02',
        },
    },
    exportButtonContainer: {
        position: 'fixed',
        top: '2em',
        left: ({ rtl }) => rtl ? null : '2em',
        right: ({ rtl }) => rtl ? '2em' : null,
        zIndex: '4',
    },
    exportButton: {
        background: 'orange',
        '&:hover': {
            background: '#bb7a02',
        },
    },
    datePickerWrapper: {
        height: '100%',
    },
    datePickerPopper: {
        zIndex: '4',
    },
}));

const CustomDateInput = ({ value, onClick, label, rootClassName }) => {
    return <TextField value={value} label={label} inputProps={{ onClick: onClick, style: { textAlign: 'center' } }} variant="outlined" classes={{ root: rootClassName }} />
};

const pxToMm = (px) => {
    return Math.floor(px / document.getElementById('myMm').offsetHeight);
};

const mmToPx = (mm) => {
    return document.getElementById('myMm').offsetHeight * mm;
};

const range = (start, end) => {
    return Array(end - start).join(0).split(0).map(function (val, id) { return id + start });
};

const TopPanel = ({ zoomIn, zoomOut, reMeasure, extraData, print, printable, onPrintClick, rtl, startDate, endDate, setStartDate, setEndDate, filter }) => {
    let classes = useStyles({ rtl });

    const exportPdf = () => {
        // yes.. the user has to choose save as pdf in the chrome print page
        window.print();

        //try 1
        // const input = document.getElementById('resourceGantt');
        // console.log(input);

        // html2canvas(input)
        //     .then((canvas) => {
        //         console.log(canvas);
        //         const imgData = canvas.toDataURL('image/png'); 
        //         // console.log(imgData);
        //         const pdf = new jsPDF({
        //             orientation: 'landscape',
        //             // unit: 'in',
        //             // format: [4, 2]
        //         });
        //         pdf.addImage(imgData, 'PNG', 0, 0);
        //         pdf.save("download.pdf");
        //     });
        // ;

        //try 2
        // let id = "resourceGantt";
        // const input = document.getElementById(id);
        // const inputHeightMm = pxToMm(input.offsetHeight);
        // const a4WidthMm = 210;
        // const a4HeightMm = 297;
        // const a4HeightPx = mmToPx(a4HeightMm);
        // const numPages = inputHeightMm <= a4HeightMm ? 1 : Math.floor(inputHeightMm / a4HeightMm) + 1;
        // console.log({
        //     input, inputHeightMm, a4HeightMm, a4HeightPx, numPages, range: range(0, numPages),
        //     comp: inputHeightMm <= a4HeightMm, inputHeightPx: input.offsetHeight
        // });


        // html2canvas(input)
        //     .then((canvas) => {
        //         const imgData = canvas.toDataURL('image/png');

        //         let pdf;
        //         // Document of a4WidthMm wide and inputHeightMm high
        //         if (inputHeightMm > a4HeightMm) {
        //             // elongated a4 (system print dialog will handle page breaks)
        //             // pdf = new jsPDF('l', 'mm', [inputHeightMm + 16, a4WidthMm]);
        //             console.log(inputHeightMm);
        //             pdf = new jsPDF('l', 'px', [297 * 3.77, 210 * 3.77]);
        //         } else {
        //             // standard a4
        //             pdf = new jsPDF();
        //         }

        //         pdf.addImage(imgData, 'PNG', 0, 0);
        //         pdf.save(`${id}.pdf`);
        //     });
        // ;
    };

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    function getStyles(name, personName) {
        return {
            fontWeight:
                personName.indexOf(name) === -1
                    ? 'normal'
                    : 'bold'
        };
    }

    return (
        <>
            {
                print ? null : (
                    <Grid gap="20px" className={classes.topPanelGrid} rows="auto" columns="auto 10px repeat(2, 120px) 1fr auto" areas={["zoom . dateStart dateEnd categoryFilter . print"]}>
                        {
                            print ? null : (
                                <>
                                    <Cell area="zoom" className={classes.zoomCell}>
                                        <IconButton onClick={() => { zoomIn(); reMeasure(); }}>
                                            <ZoomInIcon />
                                        </IconButton>
                                        <IconButton onClick={() => { zoomOut(); reMeasure(); }}>
                                            <ZoomOutIcon />
                                        </IconButton>
                                    </Cell>
                                    {
                                        setStartDate ? (
                                            <Cell area="dateStart" className={classes.dateCell}>
                                                <div className={classes.dateInputContainer}>
                                                    <ReactDatePicker
                                                        selected={startDate}
                                                        onChange={date => setStartDate(date)}
                                                        selectsStart
                                                        startDate={startDate}
                                                        endDate={endDate}
                                                        maxDate={endDate}
                                                        popperClassName={classes.datePickerPopper}
                                                        wrapperClassName={classes.datePickerWrapper}
                                                        customInput={<CustomDateInput rootClassName={classes.dateInputRoot} label="תאריך התחלה" />}
                                                    />
                                                </div>
                                            </Cell>
                                        ) : null
                                    }
                                    {
                                        setEndDate ? (
                                            <Cell area="dateEnd" className={classes.dateCell}>
                                                <div className={classes.dateInputContainer}>
                                                    <ReactDatePicker
                                                        selected={endDate}
                                                        onChange={date => setEndDate(date)}
                                                        selectsEnd
                                                        startDate={startDate}
                                                        endDate={endDate}
                                                        minDate={startDate}
                                                        popperClassName={classes.datePickerPopper}
                                                        wrapperClassName={classes.datePickerWrapper}
                                                        customInput={<CustomDateInput rootClassName={classes.dateInputRoot} label="תאריך סיום" />}
                                                    />
                                                </div>
                                            </Cell>
                                        ) : null
                                    }
                                    <Cell area="categoryFilter" >
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="demo-mutiple-chip-label">Chip</InputLabel>
                                            <Select
                                                labelId="demo-mutiple-chip-label"
                                                id="demo-mutiple-chip"
                                                multiple
                                                value={filter.category.value}
                                                // onChange={handleChange}
                                                input={<Input id="select-multiple-chip" />}
                                                renderValue={selected => (
                                                    <div className={classes.chips}>
                                                        {selected.map(value => (
                                                            <Chip key={value} label={value} className={classes.chip} />
                                                        ))}
                                                    </div>
                                                )}
                                                MenuProps={MenuProps}
                                            >
                                                {filter.category.allValues.map(name => (
                                                    <MenuItem key={name} value={name} style={getStyles(name, filter.category.value)}>
                                                        {name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Cell>
                                </>
                            )
                        }
                        {
                            printable ? (
                                <Cell area="print" className={classes.printCell}>
                                    <IconButton onClick={() => onPrintClick()}>
                                        <PrintIcon />
                                    </IconButton>
                                </Cell>
                            ) : null
                        }
                    </Grid>
                )
            }
            {
                print ? (
                    <>
                        <div className={classNames(classes.backButtonContainer, 'noprint')}>
                            <IconButton onClick={() => onPrintClick()} classes={{
                                root: classes.backButton
                            }}>
                                <ExitToAppIcon />
                            </IconButton>
                        </div>
                        <div className={classNames(classes.exportButtonContainer, 'noprint')}>
                            <IconButton onClick={() => exportPdf()} classes={{
                                root: classes.exportButton
                            }}>
                                <PictureAsPdfIcon />
                            </IconButton>
                        </div>
                    </>
                ) : null
            }
        </>
    );
};

export default TopPanel;