// @flow

import React from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import { Grid, RadioGroup, FormControlLabel } from '@material-ui/core';
import CRMRadio from 'crm-ui/CRMRadio/CRMRadio';
import { STATUS_PENDING } from 'crm-constants/estimationRequestPage/estimationCard';

import styles from '../AttributesDesktopStyles';

type Props = {
    classes: Object,
    translateStatus: string,
    status: string,
    handleChange: () => void,
    statuses: Array<Object>,
}

const ResumeStatusDesktop = ({
    classes,
    translateStatus,
    status,
    handleChange,
    statuses,
}: Props) => (
    <Grid
        container
        item
        direction='column'
        justify='center'
        xs={12}
    >
        <Grid
            className={classes.label}
            item
            container
            justify='flex-start'
            alignItems='center'
            xs={12} sm={12}
            lg={12} xl={12}
        >
            {`${translateStatus}:`}
        </Grid>
        <Grid className={classes.radioContainer}>
            <RadioGroup
                className={classes.statusGroup}
                value={status || ''}
                onChange={handleChange}
            >
                {statuses.map(({ title, value }, index) => (
                    <FormControlLabel
                        classes={{
                            root: classes.radioRoot,
                            label: classes.radioLabel,
                        }}
                        key={value}
                        value={value}
                        control={<CRMRadio />}
                        label={title !== STATUS_PENDING ? `${index + 1}. ${title}` : title}
                        className={cn({ [classes.selectedValue]: value === status })}
                    />))
                }
            </RadioGroup>
        </Grid>
    </Grid>
);

export default withStyles(styles)(ResumeStatusDesktop);
