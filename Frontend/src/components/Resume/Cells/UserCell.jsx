// @flow

import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CRMEditableField from 'crm-ui/CRMEditableField/CRMEditableField';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import UserInformationPopover from 'crm-components/common/UserInformationPopover/UserInformationPopover';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { EMPTY_VALUE } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';
import { changeResume } from 'crm-api/ResumeService/resumeService';
import type { AutoCompleteType } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';

import styles from './cellStyles';

type User = {
    id: number,
    firstName: string,
    lastName: string,
}

type Props = {
    values: [
        ?User,
        Array<User>,
        number,
        () => void,
        (boolean) => void,
    ];
    classes: Object,
};

const UserCell = ({
    values: [
        responsibleHr,
        responsibleHrList,
        id,
        reloadTable,
        setLoading,
    ],
    classes,
}: Props) => {
    const [selectedUser, setSelectedUser] = useState(null);

    const handleChange = async (hr: AutoCompleteType) => {
        setSelectedUser(!hr && EMPTY_VALUE);
        if (hr) {
            setLoading(true);
            await changeResume({ resumeId: id, responsibleHrId: hr.value });
            reloadTable();
        }
    };

    const handleSave = async () => {
        if (selectedUser === EMPTY_VALUE) {
            setLoading(true);
            await changeResume({ resumeId: id, responsibleHrId: EMPTY_VALUE });
            setSelectedUser(null);
            reloadTable();
        }
    };

    const renderCustomLabel = () => {
        return responsibleHr
            ? <UserInformationPopover
                userName={`${responsibleHr.firstName} ${responsibleHr.lastName}`}
                userNameStyle={classes.underlineName}
                userId={responsibleHr.id}
                reloadParent={reloadTable}
            />
            : <CRMEmptyBlock />;
    };

    return <CRMEditableField
        component={CRMAutocompleteSelect}
        componentType='select'
        renderCustomLabel={renderCustomLabel}
        onCloseEditMode={handleSave}
        justify='flex-start'
        showEditOnHover
        componentProps={{
            value: !!responsibleHr && { label: `${responsibleHr.firstName} ${responsibleHr.lastName}`, value: responsibleHr.id },
            options: responsibleHrList.map(hr => ({ label: `${hr.firstName} ${hr.lastName}`, value: hr.id })),
            onChange: handleChange,
            autoFocus: true,
            menuIsOpen: true,
            controlled: true,
            menuPosition: 'fixed',
        }}
    />;
};

export default withStyles(styles)(UserCell);
