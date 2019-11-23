import React from 'react';

const TopPanel = ({ zoomIn, zoomOut, reMeasure }) => {
    return (
        <div style={{ background: 'orange' }}>
            TopPanel
            <button type="button" onClick={() => { zoomIn(); reMeasure(); }}> + </button>
            <button type="button" onClick={() => { zoomOut(); reMeasure(); }}> - </button>
        </div>
    );
};

export default TopPanel;