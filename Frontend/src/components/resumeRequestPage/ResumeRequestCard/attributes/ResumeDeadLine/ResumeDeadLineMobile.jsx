// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import CRMDatePicker from 'crm-components/common/CRMDatePicker/CRMDatePicker';

import styles from '../AttributesMobileStyles';

type Props = {
    classes: Object,
    translateDeadline: string,
    deadLine: string,
    handleDateChange: () => void,
}

const ResumeDeadLineMobile = ({
    classes,
    translateDeadline,
    deadLine,
    handleDateChange,
}: Props) => (
    <Grid
        container
        justify='space-between'
        alignItems='center'
        className={classes.filedContainer}
    >
        <Typography className={classes.inputLabel}>
            {`${translateDeadline}:`}
        </Typography>
        <CRMDatePicker
            date={deadLine ? new Date(Date.parse(deadLine)) : null}
            onChange={handleDateChange}
            theme='inline'
            inlineClass={classes.fieldDate}
            minDate={new Date()}
        />
    </Grid>
);

export default withStyles(styles)(ResumeDeadLineMobile);
