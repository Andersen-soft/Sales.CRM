// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import CRMEditableField from 'crm-ui/CRMEditableField/CRMEditableField';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import UserInformationPopover from 'crm-components/common/UserInformationPopover/UserInformationPopover';
import { useMobilePlatform } from 'crm-components/common/MobileContextProvider/MobileContextProvider';

import styles from '../AttributesMobileStyles';

type Props = {
    classes: Object,
    user: Object,
    getUserUpdate: () => void,
    title: string,
    handlerCloseEditMode: () => void,
    disable: boolean,
    userList: Object,
    handleChange: () => void,
    componentProps?: Object,
}

const ResumeEmployeeSelectMobile = ({
    classes,
    user,
    getUserUpdate,
    title,
    handlerCloseEditMode,
    disable,
    userList,
    handleChange,
    componentProps,
}: Props) => {
    const os = useMobilePlatform();

    const renderCustomLabel = () => (
        user.value
            ? <Grid className={classes.inputEditable}>
                <UserInformationPopover
                    userName={user.label}
                    userNameStyle={classes.inputInfo}
                    userId={user.value}
                    reloadParent={getUserUpdate}
                />
            </Grid>
            : <CRMEmptyBlock className={classes.inputEditable} />
    );

    return (
        <Grid className={classes.filedContainer}>
            <Typography className={classes.inputLabel}>
                {title}
            </Typography>
            <CRMEditableField
                component={CRMAutocompleteSelect}
                componentType='select'
                renderCustomLabel={renderCustomLabel}
                onCloseEditMode={handlerCloseEditMode}
                disableEdit={disable}
                justify='space-between'
                componentProps={{
                    ...componentProps,
                    controlled: true,
                    value: user,
                    options: userList,
                    onChange: handleChange,
                    autoFocus: true,
                    menuIsOpen: true,
                    isSearchable: os === 'iOS',
                    menuPosition: 'absolute',
                    menuShouldBlockScroll: true,
                    maxMenuHeight: 130,
                    minMenuHeight: 100,
                    menuPlacement: 'auto',
                    menuShouldScrollIntoView: false,
                }}
            />
        </Grid>
    );
};

export default withStyles(styles)(ResumeEmployeeSelectMobile);
