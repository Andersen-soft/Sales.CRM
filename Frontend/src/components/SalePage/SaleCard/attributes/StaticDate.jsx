// @flow

import React from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { FULL_DATE_CS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './AttributesStyles';

type Props = {
    label: string,
    date: string;
} & StyledComponentProps;

const StaticDate = ({
    date, label, classes,
}: Props) => {
    return (
        <Grid
            item
            container
            direction='row'
            justify='space-between'
            alignItems='center'
            xs={12} sm={12}
            lg={12} xl={12}
            wrap='nowrap'
        >
            <Grid className={classes.label}>
                {label}
            </Grid>
            <Grid className={classes.withoutEdit}>
                {date ? getDate(date, FULL_DATE_CS) : <CRMEmptyBlock />}
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(StaticDate);
