import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { diffInDays, getDateRange } from './../../../../utils/dateUtils';

const useStyles = makeStyles(theme => ({
    hierarchyNode: {
        paddingLeft: theme.spacing(1)
    }
}));

const HeaderRow = ({ startDate, endDate, resolution }) => {
    if (!resolution)
        resolution = diffInDays(startDate, endDate) > 2 ? 'days' : 'hours';

    let dateRange = getDateRange({ startDate, endDate });
    console.log(dateRange);

    return (
        <div>
            Header Row
            {
                dateRange.map((d) => {
                    return (
                        <div>
                            {
                                d.toISOString().slice(0, 10)
                            }
                        </div>
                    )
                })
            }
        </div>
    );
};

export default HeaderRow;