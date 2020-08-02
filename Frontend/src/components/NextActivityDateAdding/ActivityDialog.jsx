// @flow

import React, { useState } from 'react';

import type { ActivityType } from 'crm-constants/NewActivityDateAdding/NewActivityDateAdding';
import { getErrors } from 'crm-utils/NewActivityDateAdding/NewActivityDateAdding';
import ActivityFormDesktop from './ActivityFormDesktop/ActivityFormDesktop';
import ActivityFormMobile from './ActivityFormMobile/ActivityFormMobile';

type Props = {
    activityTypes: ActivityType,
    contacts: Array<{ id: number, name: string, checked: boolean }>,
    comment: string,
    nextActivityDate: Date,
    activityDate: string,
    isDialogOpened: boolean,
    isMobile: boolean,
    onHandleTypeCheck: (name: string) => (event: SyntheticInputEvent<HTMLInputElement>) => void,
    onHandleContactCheck: (id: ?number) => (event: SyntheticInputEvent<HTMLInputElement>) => void,
    onHandleActivityDateChange: (date: Date) => void,
    onHandleNextActivityDateChange: (date: Date) => void,
    getRowsCountDependingOnContacts: () => number,
    onHandleCommentChange: (event: SyntheticInputEvent<HTMLInputElement>) => void,
    onHandleCommentBlur: (event: SyntheticInputEvent<HTMLInputElement>) => void,
    onHandleAddActivity: () => Promise<void>,
    onHandleConfirmationDialogOpen: () => void,
};

const ActivityDialog = ({
    activityTypes,
    contacts,
    comment,
    nextActivityDate,
    activityDate,
    isDialogOpened,
    isMobile,
    onHandleTypeCheck,
    onHandleContactCheck,
    onHandleActivityDateChange,
    onHandleNextActivityDateChange,
    getRowsCountDependingOnContacts,
    onHandleCommentChange,
    onHandleCommentBlur,
    onHandleAddActivity,
    onHandleConfirmationDialogOpen,
}: Props) => {
    const [activityTypesError, setActivityTypesError] = useState(false);
    const [contactsError, setContactsError] = useState(false);
    const [activityDateError, setActivityDateError] = useState(false);
    const [nextActivityDateError, setNextActivityDateError] = useState(false);
    const [commentError, setCommentError] = useState(false);

    const checkErrors = errors => Object.values(errors).every(value => !value);
    const isCheckedContacts = (index: number) => contacts[index].checked;

    const validateDataForAdding = () => {
        const errors = getErrors({
            activityTypes,
            contacts,
            comment,
            nextActivityDate,
            activityDate,
        });

        setActivityTypesError(errors.activityTypesError);
        setContactsError(errors.contactsError);
        setActivityDateError(errors.activityDateError);
        setNextActivityDateError(errors.nextActivityDateError);
        setCommentError(errors.commentError);

        checkErrors(errors) && onHandleAddActivity();
    };

    const ActivityForm = isMobile ? ActivityFormMobile : ActivityFormDesktop;

    return (
        <ActivityForm
            isDialogOpened={isDialogOpened}
            contactsError={contactsError}
            activityTypesError={activityTypesError}
            activityDateError={activityDateError}
            nextActivityDateError={nextActivityDateError}
            commentError={commentError}
            activityDate={activityDate}
            nextActivityDate={nextActivityDate}
            activityTypes={activityTypes}
            contacts={contacts}
            onHandleConfirmationDialogOpen={onHandleConfirmationDialogOpen}
            validateDataForAdding={validateDataForAdding}
            getRowsCountDependingOnContacts={getRowsCountDependingOnContacts}
            isCheckedContacts={isCheckedContacts}
            onHandleActivityDateChange={onHandleActivityDateChange}
            onHandleNextActivityDateChange={onHandleNextActivityDateChange}
            onHandleTypeCheck={onHandleTypeCheck}
            onHandleContactCheck={onHandleContactCheck}
            onHandleCommentChange={onHandleCommentChange}
            onHandleCommentBlur={onHandleCommentBlur}
        />
    );
};

export default ActivityDialog;
