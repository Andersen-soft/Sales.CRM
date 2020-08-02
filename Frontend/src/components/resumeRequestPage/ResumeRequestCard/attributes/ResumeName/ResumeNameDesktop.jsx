// @flow

import React from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Tooltip } from '@material-ui/core';
import CRMEditableField from 'crm-ui/CRMEditableField/CRMEditableField';
import CRMInput from 'crm-components/crmUI/CRMInput/CRMInput';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';

import styles from '../AttributesDesktopStyles';

type Props = {
    classes: Object,
    localResumeRequestName: Object | string,
    translateRequestName: string,
    changeEditMode: () => void,
    changeName: () => void,
    nameError: string,
}

const ResumeNameDesktop = ({
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
            <Typography className={cn(classes.editable, classes.cellBigEllipsis)}>
                {localResumeRequestName}
            </Typography>
        </Tooltip>
        : <CRMEmptyBlock className={classes.editable}/>
    );

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
                {`${translateRequestName}:`}
            </Grid>
            <Grid className={classes.bigValue}>
                <CRMEditableField
                    component={CRMInput}
                    componentType='input'
                    onCloseEditMode={changeEditMode}
                    renderCustomLabel={renderCustomLabel}
                    componentProps={{
                        value: localResumeRequestName,
                        onChange: changeName,
                        error: nameError,
                        fullWidth: true,
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(ResumeNameDesktop);
