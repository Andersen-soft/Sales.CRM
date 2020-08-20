// @flow

import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { Grid, Typography, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CRMEditableField from 'crm-ui/CRMEditableField/CRMEditableField';
import CRMInput from 'crm-components/crmUI/CRMInput/CRMInput';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import type { EstimationRequest } from 'crm-constants/estimationRequestPage/estimationRequestPageConstants';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './AttributesStyles';

type Props = {
    classes: Object,
    estimationId: string,
    name: string,
    updateEstimation: (estimationId: string, fieldName: string, updateData: string | number) => Promise<EstimationRequest>,
}

const EstimationName = ({
    classes,
    estimationId,
    name,
    updateEstimation,
}: Props) => {
    const [localName, setLocalName] = useState(null);
    const [nameError, setNameError] = useState(null);

    const translations = {
        requestName: useTranslation('requestForEstimation.requestSection.requestName'),
        errorMaxNumOfChars: useTranslation('forms.errorMaxNumOfChars'),
        requiredField: useTranslation('common.requiredField'),
    };

    useEffect(() => {
        if (name && name !== localName) {
            setLocalName(name);
        }
    }, [name]);

    const changeName = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        switch (true) {
            case (!value.length):
                setNameError(translations.requiredField);
                setLocalName(value);
                break;
            case (value.length > 100):
                setNameError(translations.errorMaxNumOfChars);
                setLocalName(value.substr(0, 100));
                break;
            default: {
                setNameError(null);
                setLocalName(value);
            }
        }
    };

    const renderCustomLabel = () => (localName
        ? <Tooltip
            title={localName}
            interactive
            placement='bottom-start'
        >
            <Typography className={cn(classes.editable, classes.cellEllipsis)}>
                {localName}
            </Typography>
        </Tooltip>
        : <CRMEmptyBlock className={classes.editable}/>
    );

    const changeEditMode = () => {
        if (!nameError && localName) {
            updateEstimation(estimationId, 'name', localName);
        } else {
            setLocalName(name);
            setNameError(null);
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
        >
            <Grid className={classes.label}>
                {`${translations.requestName}:`}
            </Grid>
            <Grid className={classes.value}>
                <CRMEditableField
                    component={CRMInput}
                    componentType='input'
                    onCloseEditMode={changeEditMode}
                    renderCustomLabel={renderCustomLabel}
                    componentProps={{
                        value: localName,
                        onChange: changeName,
                        error: nameError,
                        fullWidth: true,
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(EstimationName);
