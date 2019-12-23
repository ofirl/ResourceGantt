export const flattenHierarchy = (hier = [], keepChildren = false) => {
    let flatHier = [];

    let nodeList = hier.slice(1, hier.length);
    let currentNode = hier[0];

    while (currentNode) {
        flatHier.push(currentNode);
        if (currentNode.children)
            nodeList.unshift(...currentNode.children);

        currentNode = nodeList.shift();
    }

    if (keepChildren)
        return flatHier;

    return flatHier.map((node) => ({ ...node, children: null }));
};