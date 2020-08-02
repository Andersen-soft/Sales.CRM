// @flow

import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { isFuture } from 'date-fns';
import { getDate } from 'crm-utils/dates';
import CRMDateTimePicker from 'crm-ui/CRMDateTimePicker/CRMDateTimePicker';
import { CRM_DATETIME_FORMAT_DOTS, CRM_FULL_DATE_SERVER_FORMAT } from 'crm-constants/dateFormat';
import { useTranslation } from 'crm-hooks/useTranslation';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './cellsStyles';

type Props = {
    values: string,
    isEdit: boolean,
    updateEditRowState: () => void,
} & StyledComponentProps;

const ActivityDateCell = ({
    values,
    isEdit,
    updateEditRowState,
    classes,
}: Props) => {
    const [localDate, setLocalDate] = useState(values);
    const [error, setError] = useState(null);

    const translations = {
        activityTimeError: useTranslation('sale.workLogSection.activityTimeError'),
    };

    useEffect(() => {
        if (isEdit) {
            setLocalDate(values);
            setError(null);
        }
    }, [isEdit]);

    const onChangeNextActivityDate = date => {
        setLocalDate(date);

        if (isFuture(date)) {
            setError(translations.activityTimeError);
            updateEditRowState('dateActivity', Error(translations.activityTimeError));
        } else {
            updateEditRowState('dateActivity', getDate(date, CRM_FULL_DATE_SERVER_FORMAT));
        }
    };

    return (
        <Grid
            container
            direction='column'
        >
            {isEdit
                ? <Grid>
                    <CRMDateTimePicker
                        value={localDate}
                        onChange={onChangeNextActivityDate}
                        inputVariant='standard'
                        disableFuture
                        InputProps={{
                            classes: { input: classes.dateInput },
                        }}
                        format={CRM_DATETIME_FORMAT_DOTS}
                    />
                    {error && <Typography className={classes.errorMessage}>{error}</Typography>}
                </Grid>
                : <Grid className={classes.dateOfActivity}>
                    {getDate(values, CRM_DATETIME_FORMAT_DOTS)}
                </Grid>
            }
        </Grid>
    );
};

export default withStyles(styles)(ActivityDateCell);
