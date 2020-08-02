// @flow

import React from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { CRM_DATETIME_FORMAT_DOTS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './cellsStyles';

type Props = {
    values: Array<File>,
} & StyledComponentProps;

const DateCell = ({
    values: files,
    classes,
}: Props) => (
    <Grid
        container
        direction='column'
    >
        {
            files.map(file => (
                <div key={file.id} className={classes.fileDate}>
                    {getDate(file.addedDate, CRM_DATETIME_FORMAT_DOTS)}
                </div>
            ))
        }
    </Grid>
);

export default withStyles(styles)(DateCell);
