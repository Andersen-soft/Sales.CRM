// @flow

import React, { useState } from 'react';
import { addDays, endOfDay } from 'date-fns';
import { CRM_FULL_DATE_SERVER_FORMAT, CRM_DATETIME_FORMAT_CAPITAL_MONTH } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import { getActivities } from 'crm-api/desktopService/activityService';
import { getContacts } from 'crm-api/contactsCard/contactsCardService';
import { getTypes } from 'crm-api/activityHistory/activityHistoryService';
import Notification from 'crm-components/notification/NotificationSingleton';
import { NOTIFICATION_ERROR, EMAIL_ACTIVITY } from 'crm-constants/NewActivityDateAdding/NewActivityDateAdding';
import ActivityDialog from './ActivityDialog';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';
import EventEmitter from 'crm-helpers/eventEmitter';
import CustomButtons from './CustomButtons/CustomButtons';
import { useTranslation } from 'crm-hooks/useTranslation';
import { crmTrim } from 'crm-utils/trimValue';

import type { fetchSalesArguments } from 'crm-api/desktopService/salesService';
import type { addActivityArguments } from 'crm-api/desktopService/activityService';
import type { UpdateSalePayload } from 'crm-api/saleService';

type Props = {
    isUseInSalePage: boolean,
    company: number,
    addActivity: (data: addActivityArguments) => void,
    statusFilter: Array<string>,
    nextActivityDatePicker: string,
    companySaleId: number,
    query: string,
    editSale: (id: number, editSaleBody: UpdateSalePayload, salesRequestParams?: fetchSalesArguments) => void,
    createDate: string,
    mainContactId: number,
    size: number,
    page: number,
    userId: number,
    updatePastActivitiesCount?: () => void,
}

const getNextActivityDate = () => addDays(endOfDay(Date.now()), 1);

const NextActivityDateAdding = ({
    isUseInSalePage,
    company,
    addActivity,
    statusFilter,
    nextActivityDatePicker,
    companySaleId,
    query,
    editSale,
    createDate,
    mainContactId,
    size,
    page,
    userId,
    updatePastActivitiesCount,
}: Props) => {
    const [isDialogOpened, setIsDialogOpened] = useState(false);
    const [activityTypes, setActivityTypes] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [activityDate, setActivityDate] = useState(getDate(new Date(), CRM_FULL_DATE_SERVER_FORMAT));
    const [nextActivityDate, setNextActivityDate] = useState(getNextActivityDate());
    const [comment, setComment] = useState('');
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [activities, setActivities] = useState([]);

    const translations = {
        dialogCancelActivity: useTranslation('desktop.addActivity.dialogCancelActivity'),
        errorActivityExistsStart: useTranslation('desktop.addActivity.errorActivityExistsStart'),
        errorActivityExistsEnd: useTranslation('desktop.addActivity.errorActivityExistsEnd'),
    };

    const isMobile = useMobile();

    const getRowsCountDependingOnContacts = () => {
        const contactsLength = contacts.length;

        switch (true) {
            case (contactsLength > 15):
                return 49;
            case (contactsLength > 10):
                return 41;
            default:
                return 20;
        }
    };

    const handleAddActivity = async () => {
        const payloadContacts = contacts.filter(({ checked }) => checked).map(({ id }) => id);
        const payloadTypes = activityTypes.filter(({ checked }) => checked).map(({ activityTypeEnumCode }) => activityTypeEnumCode);
        const nextActivity = getDate(nextActivityDate, CRM_FULL_DATE_SERVER_FORMAT);

        handleAddNextActivityDialogClose();

        await addActivity({
            companySaleId,
            contacts: payloadContacts,
            types: payloadTypes,
            dateActivity: activityDate,
            description: comment,
        });
        if (isUseInSalePage) {
            await editSale(
                companySaleId,
                { nextActivityDate: nextActivity }
            );
        } else {
            await editSale(
                companySaleId,
                { nextActivityDate: nextActivity },
                {
                    isFirstRequest: true,
                    statusFilter,
                    activityDate: nextActivityDatePicker,
                    search: query,
                    userId,
                    size,
                    page,
                }
            );

            updatePastActivitiesCount && updatePastActivitiesCount();
        }

        if (activities.some(({ dateActivity }) => dateActivity.slice(0, 16) === activityDate.slice(0, 16))) {
            Notification.showMessage({
                message: `${translations.errorActivityExistsStart}
                    ${getDate(activityDate, CRM_DATETIME_FORMAT_CAPITAL_MONTH)}
                    ${translations.errorActivityExistsEnd}`,
                type: 'warning',
                closeTimeout: 15000,
            });
        }
    };

    const handleActivityDateChange = (date: Date) => {
        setActivityDate(getDate(date, CRM_FULL_DATE_SERVER_FORMAT));
    };

    const handleNextActivityDateChange = (date: Date) => {
        setNextActivityDate(endOfDay(date));
    };

    const handleCommentChange = ({ target: { value: commentValue } }: SyntheticInputEvent<HTMLInputElement>) => {
        commentValue.trim().length ? setComment(commentValue) : setComment('');
    };

    const onHandleCommentBlur = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        setComment(crmTrim(value));
    };

    const handleContactCheck = (id: ?number) => (event: SyntheticInputEvent<HTMLInputElement>) => {
        const newContacts = contacts.map(item => (item.id === id ? {
            ...item,
            checked: event.target.checked,
        } : item));

        setContacts(newContacts);
    };

    const handleTypeCheck = (activityCode: string) => (event: SyntheticInputEvent<HTMLInputElement>) => {
        const newActivityTypes = activityTypes.map(item => (item.activityTypeEnumCode === activityCode ? {
            ...item,
            checked: event.target.checked,
        } : item));

        setActivityTypes(newActivityTypes);
    };

    const handleAddNextActivityDialogClose = () => {
        isMobile && EventEmitter.emit('closeDotMenu');
        resetState();
    };

    const handleAddNextActivityDialogOpen = async () => {
        const activitiesPromise = getActivities({ companySale: companySaleId });
        const contactsPromise = getContacts(company);
        const typesPromise = getTypes();

        const [activitiesList,
            contactsFromResponse,
            types,
        ] = await Promise.all([activitiesPromise, contactsPromise, typesPromise]);

        const transformedTypes = types.map(({ type, typeEnumCode }) =>
            (typeEnumCode === EMAIL_ACTIVITY
                ? { name: type, activityTypeEnumCode: typeEnumCode, checked: true }
                : { name: type, activityTypeEnumCode: typeEnumCode, checked: false })
        );

        const contactsList = contactsFromResponse.content.map(contact => ({
            id: contact.id,
            name: `${contact.firstName} ${contact.lastName}`,
            checked: contact.id === mainContactId,
        }));

        if (contactsList.length !== 0) {
            setActivityTypes(transformedTypes);
            setContacts(contactsList);
            setIsDialogOpened(true);
            setActivityDate(getDate(new Date(), CRM_FULL_DATE_SERVER_FORMAT));
            setActivities(activitiesList.content);
        } else {
            Notification.showMessage({
                message: NOTIFICATION_ERROR,
                closeTimeout: 15000,
            });
        }
    };

    const handleConfirmationDialogOpen = () => {
        setShowConfirmationDialog(true);
    };

    const handleConfirmationDialogClose = () => {
        setShowConfirmationDialog(false);
    };

    const resetState = () => {
        setIsDialogOpened(false);
        setActivityTypes([]);
        setContacts([]);
        setActivityDate(getDate(new Date(), CRM_FULL_DATE_SERVER_FORMAT));
        setNextActivityDate(getNextActivityDate());
        setComment('');
    };

    const cancelCreateActivity = () => {
        handleAddNextActivityDialogClose();
        handleConfirmationDialogClose();
    };

    return (
        <>
            <CustomButtons
                isUseInSalePage={isUseInSalePage}
                openDialog={handleAddNextActivityDialogOpen}
            />
            <ActivityDialog
                activityTypes={activityTypes}
                nextActivityDate={nextActivityDate}
                activityDate={activityDate}
                contacts={contacts}
                comment={comment}
                isDialogOpened={isDialogOpened}
                isMobile={isMobile}
                onHandleConfirmationDialogOpen={handleConfirmationDialogOpen}
                onHandleTypeCheck={handleTypeCheck}
                onHandleContactCheck={handleContactCheck}
                onHandleCommentChange={handleCommentChange}
                onHandleCommentBlur={onHandleCommentBlur}
                onHandleNextActivityDateChange={handleNextActivityDateChange}
                onHandleActivityDateChange={handleActivityDateChange}
                onHandleAddActivity={handleAddActivity}
                getRowsCountDependingOnContacts={getRowsCountDependingOnContacts}
            />
            <CancelConfirmation
                showConfirmationDialog={showConfirmationDialog}
                onConfirmationDialogClose={handleConfirmationDialogClose}
                onConfirm={cancelCreateActivity}
                text={translations.dialogCancelActivity}
            />
        </>
    );
};

export default NextActivityDateAdding;
