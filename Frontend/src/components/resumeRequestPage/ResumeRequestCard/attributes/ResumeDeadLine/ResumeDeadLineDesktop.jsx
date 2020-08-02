// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import CRMDatePicker from 'crm-components/common/CRMDatePicker/CRMDatePicker';

import styles from '../AttributesDesktopStyles';

type Props = {
    classes: Object,
    translateDeadline: string,
    deadLine: string,
    handleDateChange: () => void,
}

const ResumeDeadLineDesktop = ({
    classes,
    translateDeadline,
    deadLine,
    handleDateChange,
}: Props) => (
    <Grid
        item
        container
        direction='row'
        justify='space-between'
        alignItems='center'
        xs={12}
        wrap='nowrap'
    >
        <Grid className={classes.label}>
            {`${translateDeadline}:`}
        </Grid>
        <Grid className={classes.withoutEdit}>
            <CRMDatePicker
                date={deadLine ? new Date(Date.parse(deadLine)) : null}
                onChange={handleDateChange}
                theme='inline'
                inlineClass={classes.date}
                minDate={new Date()}
            />
        </Grid>
    </Grid>
);

export default withStyles(styles)(ResumeDeadLineDesktop);
