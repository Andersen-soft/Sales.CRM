// @flow

import React from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import { Grid, Typography, RadioGroup, FormControlLabel } from '@material-ui/core';
import CRMRadio from 'crm-ui/CRMRadio/CRMRadio';
import { STATUS_PENDING } from 'crm-constants/estimationRequestPage/estimationCard';

import styles from '../AttributesMobileStyles';

type Props = {
    classes: Object,
    translateStatus: string,
    status: string,
    handleChange: () => void,
    statuses: Array<Object>,
}

const ResumeStatusMobile = ({
    classes,
    translateStatus,
    status,
    handleChange,
    statuses,
}: Props) => (
    <Grid className={classes.filedContainer}>
        <Typography className={classes.inputLabel}>
            {`${translateStatus}:`}
        </Typography>
        <RadioGroup
            className={classes.statusRadioGroup}
            value={status || ''}
            onChange={handleChange}
        >
            <Grid container>
                {statuses.map(({ title, value }, index) => (
                    <Grid
                        key={value}
                        item
                        xs={6}
                        className={classes.statusRadioItem}
                    >
                        <FormControlLabel
                            classes={{
                                root: classes.statusRadioRoot,
                                label: classes.statusRadioLabel,
                            }}
                            value={value}
                            control={<CRMRadio />}
                            label={title !== STATUS_PENDING ? `${index + 1}. ${title}` : title}
                            className={cn({ [classes.statusSelectedValue]: value === status })}
                        />
                    </Grid>))
                }
            </Grid>
        </RadioGroup>
    </Grid>
);

export default withStyles(styles)(ResumeStatusMobile);
