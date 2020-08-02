// @flow

import React from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CRMDatePicker from 'crm-components/common/CRMDatePicker/CRMDatePicker';
import { FULL_DATE_DS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import type { EstimationRequest } from 'crm-constants/estimationRequestPage/estimationRequestPageConstants';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './AttributesStyles';

type Props = {
    classes: Object,
    estimationId: string,
    deadLine: string,
    updateEstimation: (estimationId: string, fieldName: string, updateData: string | number) => Promise<EstimationRequest>,
}

const EstimationRequestDeadLine = ({
    classes,
    estimationId,
    deadLine,
    updateEstimation,
}: Props) => {
    const translations = {
        deadline: useTranslation('requestForEstimation.requestSection.deadline'),
    };

    const handleDateChange = date => {
        if (date) {
            updateEstimation(estimationId, 'deadLine', getDate(date, FULL_DATE_DS));
        }
    };

    return (
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
                {`${translations.deadline}:`}
            </Grid>
            <Grid className={classes.withoutEdit}>
                <CRMDatePicker
                    date={deadLine}
                    onChange={handleDateChange}
                    theme='inline'
                    inlineClass={classes.deadlineDate}
                    minDate={new Date()}
                />
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(EstimationRequestDeadLine);
