import React from 'react';
import ActivityComponent from './ActivityComponent';

const StatefulActivityComponent = (props) => {
    return (
        <ActivityComponent {...props} />
    );
};

export default StatefulActivityComponent;