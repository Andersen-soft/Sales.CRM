// @flow

import React from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import CRMEditableField from 'crm-ui/CRMEditableField/CRMEditableField';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import UserInformationPopover from 'crm-components/common/UserInformationPopover/UserInformationPopover';

import styles from '../AttributesDesktopStyles';

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

const ResumeEmployeeSelectDesktop = ({
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
    const renderCustomLabel = () => (
        user.value
            ? <UserInformationPopover
                userName={user.label}
                userNameStyle={cn({ [classes.disable]: disable }, classes.fullName)}
                userId={user.value}
                reloadParent={getUserUpdate}
            />
            : <CRMEmptyBlock className={cn(classes.editable, { [classes.disable]: disable })} />
    );

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
                {title}
            </Grid>
            <Grid className={classes.value}>
                <CRMEditableField
                    component={CRMAutocompleteSelect}
                    componentType='select'
                    renderCustomLabel={renderCustomLabel}
                    onCloseEditMode={handlerCloseEditMode}
                    disableEdit={disable}
                    componentProps={{
                        ...componentProps,
                        controlled: true,
                        value: user,
                        options: userList,
                        onChange: handleChange,
                        autoFocus: true,
                        menuIsOpen: true,
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(ResumeEmployeeSelectDesktop);
