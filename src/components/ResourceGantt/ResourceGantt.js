import React, { Fragment } from 'react';
import TopPanel from './components/TopPanel';
import { ThemeProvider } from '@material-ui/core/styles';

import { Grid, Cell } from "styled-css-grid";
import ResourceHierarchy from './components/ResourceHierarchy';

import defaultTheme from './defaultTheme';

const ResourceGantt = ({ hierarchy = [] }) => {
    return (
        <ThemeProvider theme={defaultTheme}>
            <Fragment>
                <Grid columns={2} rows={"auto 1fr"} areas={["top top", "hier gantt"]}>
                    <Cell area="top">
                        <TopPanel />
                    </Cell>
                    <Cell area="hier">
                        <ResourceHierarchy hierarchy={hierarchy} />
                    </Cell>
                    <Cell area="gantt">
                        <div>
                            resource gantt
                    </div>
                    </Cell>
                </Grid>
            </Fragment>
        </ThemeProvider>
    );
};

export default ResourceGantt;