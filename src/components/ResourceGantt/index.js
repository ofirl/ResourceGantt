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

const flattenHierarchy = (hier = []) => {
    let flatHier = [];

    let nodeList = hier.slice(1, hier.length);
    let currentNode = hier[0];

    while (currentNode) {
        flatHier.push(currentNode);
        if (currentNode.children)
            nodeList.unshift(...currentNode.children);

        currentNode = nodeList.shift();
    }

    return flatHier.map((node) => ({ ...node, children: null }));
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