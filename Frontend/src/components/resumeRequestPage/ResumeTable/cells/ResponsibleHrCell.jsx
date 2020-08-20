// @flow

import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CRMEditableField from 'crm-ui/CRMEditableField/CRMEditableField';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import UserInformationPopover from 'crm-components/common/UserInformationPopover/UserInformationPopover';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';

import { EMPTY_VALUE } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';

import type {
    UserKeys,
    AutoCompleteType,
} from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';
import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './cellsStyles';

type Props = {
    values: [
        UserKeys,
        Array<UserKeys>,
        ({ responsibleHrId: number }) => void,
        () => void,
    ],
} & StyledComponentProps;

const ResponsibleHrCell = ({
    values: [
        user,
        responsibleList,
        onSave,
        updateParent,
    ],
    classes,
}: Props) => {
    const [selectedUser, setSelectedUser] = useState(null);

    const handleChange = (hr: AutoCompleteType) => {
        setSelectedUser(!hr && EMPTY_VALUE);
        hr && onSave({ responsibleHrId: hr.value });
    };

    const handleSave = () => {
        if (selectedUser === EMPTY_VALUE) {
            onSave({ responsibleHrId: EMPTY_VALUE });
            setSelectedUser(null);
        }
    };

    const renderCustomLabel = () => user
        ? <UserInformationPopover
            userName={`${user.firstName} ${user.lastName}`}
            userNameStyle={classes.userInformation}
            userId={user.id}
            reloadParent={updateParent}
        />
        : <CRMEmptyBlock />;


    return <CRMEditableField
        component={CRMAutocompleteSelect}
        componentType='select'
        renderCustomLabel={renderCustomLabel}
        onCloseEditMode={handleSave}
        justify='flex-start'
        showEditOnHover
        componentProps={{
            value: !!user && { label: `${user.firstName} ${user.lastName}`, value: user.id },
            options: responsibleList.map(hr => ({ label: `${hr.firstName} ${hr.lastName}`, value: hr.id })),
            onChange: handleChange,
            autoFocus: true,
            menuIsOpen: true,
        }}
    />;
};

export default withStyles(styles)(ResponsibleHrCell);
