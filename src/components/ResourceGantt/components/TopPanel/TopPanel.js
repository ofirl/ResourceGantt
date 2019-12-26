import React from 'react';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const pxToMm = (px) => {
    return Math.floor(px / document.getElementById('myMm').offsetHeight);
};

const mmToPx = (mm) => {
    return document.getElementById('myMm').offsetHeight * mm;
};

const range = (start, end) => {
    return Array(end - start).join(0).split(0).map(function (val, id) { return id + start });
};

const TopPanel = ({ zoomIn, zoomOut, reMeasure, extraData, print }) => {
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
        <div id="top" style={{ background: 'orange' }}>
            <div id="myMm" style={{ height: "1mm" }} />
            {
                print ? null : (
                    <React.Fragment>
                        TopPanel
                        <button type="button" onClick={() => { zoomIn(); reMeasure(); }}> + </button>
                        <button type="button" onClick={() => { zoomOut(); reMeasure(); }}> - </button>
                    </React.Fragment>
                )
            }
            {
                print ? (
                    <button type="button" onClick={() => exportPdf()}> export PDF </button>
                ) : null
            }
        </div >
    );
};

export default TopPanel;