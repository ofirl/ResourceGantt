import React from 'react';
import ResourceGantt from './ResourceGantt';

const defaultTheme = {
    border: '1px solid #999',
    hierBackground: '#122342',
    hierColor: 'white',
    headerRowBackground: '#122342',
    headerRowColor: 'white',
    topPanelBackground: 'orange',
    topPanelColor: 'black',
};

const StatefulResourceGantt = (props) => {
    let { ganttTheme } = props;
    if (ganttTheme == null)
        ganttTheme = defaultTheme;

    return (
        <ResourceGantt {...props} ganttTheme={ganttTheme} />
    );
};

export default StatefulResourceGantt;