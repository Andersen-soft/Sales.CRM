// @flow

import React, { useState, useEffect } from 'react';
import {
    Grid,
    RadioGroup,
    FormControlLabel,
} from '@material-ui/core';
import CRMRadio from 'crm-ui/CRMRadio/CRMRadio';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import { getEstimationStatus } from 'crm-api/estimationRequestPageService/estimationCard';
import Notification from 'crm-components/notification/NotificationSingleton';
import type { EstimationRequest } from 'crm-constants/estimationRequestPage/estimationRequestPageConstants';
import { useTranslation } from 'crm-hooks/useTranslation';
import { STATUS_PENDING } from 'crm-constants/estimationRequestPage/estimationCard';

import styles from './AttributesStyles';

type Props = {
    classes: Object,
    status: string,
    estimationId: string,
    updateEstimation: (estimationId: string, fieldName: string, updateData: string | number) => Promise<EstimationRequest>,
    cancelLoading: () => void,
}

const EstimationStatus = ({
    classes,
    status,
    estimationId,
    updateEstimation,
    cancelLoading,
}: Props) => {
    const [statusList, setStatusList] = useState([]);
    const [value, setValue] = useState('');

    const translations = {
        requestStatus: useTranslation('requestForEstimation.requestSection.requestStatus'),
        notificationChangeStatus: useTranslation('requestForEstimation.requestSection.notificationChangeStatus'),
    };

    useEffect(() => {
        (async () => {
            const statusListData = await getEstimationStatus();

            setStatusList(statusListData);
        })();
    }, []);

    useEffect(() => {
        !value && setValue(status);
    });

    const handleChange = async ({ target: { value: valueData } }: SyntheticInputEvent<HTMLInputElement>) => {
        try {
            await updateEstimation(estimationId, 'status', valueData);
            setValue(valueData);
        } catch (error) {
            Notification.showMessage({
                message: translations.notificationChangeStatus,
                closeTimeout: 15000,
            });
            cancelLoading();
        }
    };

    const renderFormControlLabel = (statusData, index) => (
        <Grid
            container
            item
            xs={12}
            className={classes.statusRadioItem}
            alignItems='flex-end'
        >
            <FormControlLabel
                classes={{
                    root: classes.statusRadioRoot,
                    label: classes.statusRadioLabel,
                }}
                value={statusData}
                control={<CRMRadio />}
                label={index > 0 ? `${index}. ${statusData}` : statusData}
                className={cn({ [classes.statusSelectedValue]: statusData === status })}
            />
        </Grid>
    );

    return (
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
                xs={12}
            >
                {`${translations.requestStatus}:`}
            </Grid>
            <RadioGroup
                className={classes.statusRadioGroup}
                value={value}
                onChange={handleChange}
            >
                <Grid
                    className={classes.statusRadioContainer}
                    container
                    justify='space-between'
                >
                    <Grid item container xs={9}>
                        {statusList.map((statusData, index) =>
                            statusData !== STATUS_PENDING
                            && <Grid item container xs={6} key={statusData}>
                                {renderFormControlLabel(statusData, index + 1)}
                            </Grid>
                        )}
                    </Grid>
                    <Grid item container xs={3}>
                        {renderFormControlLabel(STATUS_PENDING, 0)}
                    </Grid>
                </Grid>
            </RadioGroup>
        </Grid>
    );
};

export default withStyles(styles)(EstimationStatus);
