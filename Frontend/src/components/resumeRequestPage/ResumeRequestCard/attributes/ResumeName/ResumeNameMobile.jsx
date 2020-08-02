// @flow

import React from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Tooltip } from '@material-ui/core';
import CRMEditableField from 'crm-ui/CRMEditableField/CRMEditableField';
import CRMInput from 'crm-components/crmUI/CRMInput/CRMInput';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';

import styles from '../AttributesMobileStyles';

type Props = {
    classes: Object,
    localResumeRequestName: Object | string,
    translateRequestName: string,
    changeEditMode: () => void,
    changeName: () => void,
    nameError: string,
}

const ResumeNameMobile = ({
    classes,
    localResumeRequestName,
    translateRequestName,
    changeEditMode,
    changeName,
    nameError,
}: Props) => {
    const renderCustomLabel = () => (localResumeRequestName
        ? <Tooltip
            title={localResumeRequestName}
            interactive
            placement='bottom-start'
        >
            <Typography className={cn(classes.inputEditable, classes.inputEllipsis)}>
                {localResumeRequestName}
            </Typography>
        </Tooltip>
        : <CRMEmptyBlock className={classes.inputEditable}/>
    );

    return (
        <Grid className={classes.filedContainer}>
            <Typography className={classes.inputLabel}>
                {`${translateRequestName}:`}
            </Typography>
            <CRMEditableField
                component={CRMInput}
                componentType='input'
                renderCustomLabel={renderCustomLabel}
                onCloseEditMode={changeEditMode}
                justify='space-between'
                componentProps={{
                    value: localResumeRequestName,
                    onChange: changeName,
                    error: nameError,
                    showErrorMessage: true,
                    fullWidth: true,
                }}
            />
        </Grid>
    );
};

export default withStyles(styles)(ResumeNameMobile);
