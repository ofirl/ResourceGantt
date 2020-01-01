import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
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
    backButtonContainer: {
        position: 'fixed',
        top: '2em',
        right: ({ rtl }) => rtl ? null : '2em',
        left: ({ rtl }) => rtl ? '2em' : null,
        zIndex: '4',
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
    datePickerPopper: {
        zIndex: '4',
    },
}));

const pxToMm = (px) => {
    return Math.floor(px / document.getElementById('myMm').offsetHeight);
};

const mmToPx = (mm) => {
    return document.getElementById('myMm').offsetHeight * mm;
};

const range = (start, end) => {
    return Array(end - start).join(0).split(0).map(function (val, id) { return id + start });
};

const TopPanel = ({ zoomIn, zoomOut, reMeasure, extraData, print, printable, onPrintClick, rtl, startDate, endDate, setStartDate, setEndDate }) => {
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

    return (
        <>
            {
                print ? null : (
                    <Grid style={{ background: 'orange' }} rows="auto" columns="auto auto 1fr auto" areas={["zoom dates . print"]}>
                        {
                            print ? null : (
                                <>
                                    <Cell area="zoom">
                                        <IconButton onClick={() => { zoomIn(); reMeasure(); }}>
                                            <ZoomInIcon />
                                        </IconButton>
                                        <IconButton onClick={() => { zoomOut(); reMeasure(); }}>
                                            <ZoomOutIcon />
                                        </IconButton>
                                    </Cell>
                                    <Cell area="dates">
                                        <ReactDatePicker
                                            selected={startDate}
                                            onChange={date => setStartDate(date)}
                                            selectsStart
                                            startDate={startDate}
                                            endDate={endDate}
                                            popperClassName={classes.datePickerPopper}
                                        />
                                        <ReactDatePicker
                                            selected={endDate}
                                            onChange={date => setEndDate(date)}
                                            selectsEnd
                                            startDate={startDate}
                                            endDate={endDate}
                                            minDate={startDate}
                                            popperClassName={classes.datePickerPopper}
                                        />
                                    </Cell>
                                </>
                            )
                        }
                        {
                            printable ? (
                                <Cell area="print">
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
                        <div className={classes.backButtonContainer}>
                            <IconButton onClick={() => onPrintClick()} classes={{
                                root: classes.backButton
                            }}>
                                <ExitToAppIcon />
                            </IconButton>
                        </div>
                        <div className={classes.exportButtonContainer}>
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
        // <div style={{ background: 'orange' }}>
        //     {/* <div id="myMm" style={{ height: "1mm" }} /> */}
        //     {
        //         print ? null : (
        //             <React.Fragment>
        //                 <IconButton onClick={() => { zoomIn(); reMeasure(); }}>
        //                     <ZoomInIcon />
        //                 </IconButton>
        //                 <IconButton onClick={() => { zoomOut(); reMeasure(); }}>
        //                     <ZoomOutIcon />
        //                 </IconButton>
        //             </React.Fragment>
        //         )
        //     }
        //     {
        //         print ? (
        //             <button type="button" onClick={() => exportPdf()}> export PDF </button>
        //         ) : null
        //     }
        // </div >
    );
};

export default TopPanel;