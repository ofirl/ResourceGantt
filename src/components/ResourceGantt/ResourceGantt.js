import React, { Fragment } from 'react';
import TopPanel from './components/TopPanel';
import { ThemeProvider } from '@material-ui/core/styles';

import { Grid, Cell } from "styled-css-grid";
import ResourceHierarchy from './components/ResourceHierarchy';

import defaultTheme from './defaultTheme';
import HeaderRow from './components/HeaderRow';

const ResourceGantt = ({ hierarchy = [], activities = [], startDate = "", endDate= "" }) => {
    let headerRowProps = {
        startDate: new Date(Date.parse(startDate)),
        endDate: new Date(Date.parse(endDate))
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Fragment>
                <Grid columns={"minmax(200px, 10%) auto"} rows={"auto auto 1fr"} areas={["top top", ". headerRow", "gantt gantt"]}>
                    <Cell area="top">
                        <TopPanel />
                    </Cell>
                    <Cell area="headerRow">
                        <HeaderRow {...headerRowProps} />
                    </Cell>
                    <Cell area="gantt">
                        <ResourceHierarchy hierarchy={hierarchy} />
                    </Cell>
                    {/* <Cell area="gantt">
                        <div>
                            resource gantt
                        </div>
                    </Cell> */}
                </Grid>
            </Fragment>
        </ThemeProvider>
    );
};

export default ResourceGantt;