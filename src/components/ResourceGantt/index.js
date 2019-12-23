import React from 'react';
import ResourceGantt from './ResourceGantt';

import { flattenHierarchy } from '../../utils/hierarchyUtils';

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

    let flatHier = flattenHierarchy(props.hierarchy);

    return (
        <ResourceGantt {...props} ganttTheme={ganttTheme} flatHierarchy={flatHier} />
    );
};

export default StatefulResourceGantt;