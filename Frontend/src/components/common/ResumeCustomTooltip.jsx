// @flow

import React from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styles from 'crm-components/resumeRequestPage/ResumeTable/ResumeTableStyles';

type Props = {
    classes: Object,
    name: string,
};

function ResumeCustomTooltip(props: Props) {
    const { classes, name } = props;

    return (
        <Grid className={classes.customTooltip}>
            {name}
        </Grid>
    );
}

export default withStyles(styles)(ResumeCustomTooltip);
