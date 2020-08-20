// @flow

import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Grid,
    Paper,
    Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { pathOr } from 'ramda';
import cn from 'classnames';
import { getSaleById } from 'crm-api/saleService';
import { isArchiveStatus } from 'crm-utils/dataTransformers/sales/isSaleArchived';
import applyForUsers from 'crm-utils/sales/applyForUsers';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import Notification from 'crm-components/notification/NotificationSingleton';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import type { StyledComponentProps } from '@material-ui/core/es';
import NewContactModal from './newContactModal';
import {
    FioAndPositionCell,
    WorkEmailAndPrivateEmailCell,
    SocialNetworkAndSocialNetworlUserCell,
    SkypeAndPhoneCell,
    CountryAndBirthdayCell,
    ActionsCell,
} from './cells';

import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './ContactsCardStyles';

export type ContactsType = {
    country: string,
    email: string,
    firstName: string,
    id: number,
    isActive: boolean,
    lastName: string,
    personalEmail: string,
    phone: string,
    position: string,
    skype: string,
    socialContact: string,
    socialNetwork: string,
    countryId: number,
    socialNetworkUser: ?{ id?: number, name?: string },
    socialNetworkUserId: number,
    recommendation: null | { id: number, name: string },
    sex: string,
    dateOfBirth: ?string,
};

type updateContactData = {
    id?: number,
    countryId?: number,
    email?: string | Error,
    firstName?: string | Error,
    lastName?: string,
    personalEmail?: string | Error,
    phone?: string,
    position?: string,
    skype?: string,
    socialNetwork?: string | Error,
    socialNetworkUserId?: number,
    recommendationId? : number,
};

type Props = {
    saleId: number;
    contacts: Array<ContactsType>;
    fetchContacts: (companyId: string) => void;
    updateOneContact: (contactId: number, data: updateContactData, companyId: number) => void;
    deleteOneContact: (contactId: number, companyId: number) => void;
    createOneContact: (newContact: number) => void,
    fetchSaleCard: (saleId: number) => void;
    updateSaleCard: (id: number, Object) => void,
    fetchActivities: (saleId: number) => void,
    fetchCompanyCard: (companyId: number) => void,
    status: string;
    company: { id: number },
    userData: Object,
    responsibleId: boolean,
    mainContactId: number,
    mainContact: ContactsType,
} & StyledComponentProps;

const FIO_KEY = 'fio';

const ContactsCard = ({
    saleId,
    fetchContacts,
    company,
    classes,
    contacts = [],
    updateOneContact,
    deleteOneContact,
    status,
    fetchSaleCard,
    updateSaleCard,
    fetchActivities,
    userData: { roles, id: userId, username },
    responsibleId,
    createOneContact,
    mainContactId,
    mainContact,
    fetchCompanyCard,
}: Props) => {
    const [companyId, setCompanyId] = useState(null);
    const [modalIsShowed, setModalIsShowed] = useState(false);
    const [sendRequest, setSendRequest] = useState(false);
    const [deleteContactId, setDeleteContactId] = useState(null);
    const [editContact, setEditContact]: [updateContactData, Function] = useState({});
    const [localContacts, setLocalContacts] = useState([]);
    const [newMainContact, setNewMainContact] = useState(null);

    const translations = {
        contacts: useTranslation('sale.contactSection.contacts'),
        fullNameOrPosition: useTranslation('sale.contactSection.fullNameOrPosition'),
        email: useTranslation('sale.contactSection.email'),
        socialNetworkOrVirtualProfile: useTranslation('sale.contactSection.socialNetworkOrVirtualProfile'),
        skypeOrPhone: useTranslation('sale.contactSection.skypeOrPhone'),
        birthdayOrCountry: useTranslation('sale.contactSection.birthdayOrCountry'),
        notificationDeleteContact: useTranslation('sale.contactSection.notificationDeleteContact'),
        add: useTranslation('common.add'),
        errorMainContactDelete: useTranslation('sale.contactSection.errorMainContactDelete'),
        change: useTranslation('common.change'),
        cancel: useTranslation('common.cancel'),
        mainContact: useTranslation('sale.contactSection.mainContact'),
        willBeChange: useTranslation('sale.contactSection.willBeChange'),
    };

    useEffect(() => {
        (async () => {
            const { company: { id: currentCompanyId } } = await getSaleById(saleId);

            setCompanyId(currentCompanyId);
            fetchContacts(currentCompanyId);
        })();
    }, []);

    useEffect(() => {
        if (companyId !== company.id) {
            setCompanyId(company.id);
        }
    }, [company]);

    useEffect(() => {
        const sortedContactList = contacts.reduce((result, contact) => {
            if (contact.id === mainContactId) {
                result.unshift(contact);

                return result;
            }

            result.push(contact);

            return result;
        }, []);

        setLocalContacts(sortedContactList);
    }, [contacts, mainContactId]);

    const toggleModalVisibility = () => {
        setModalIsShowed(!modalIsShowed);
        setSendRequest(false);
    };

    const closeModal = () => setModalIsShowed(false);

    const handlerSetSendRequest = () => setSendRequest(true);

    const saveContactChange = () => {
        const hasError = Object.values(editContact).some(value => value instanceof Error);

        if (!hasError && companyId && editContact.id) {
            updateOneContact(editContact.id, editContact, companyId)
                .then(() => {
                    fetchSaleCard(saleId);
                    fetchActivities(saleId);
                    setEditContact({});

                    if (editContact.recommendationId) {
                        fetchCompanyCard(companyId);
                    }
                });
        }
    };

    const changeMainContact = (newMainContactId: number) => {
        const contact = localContacts.find(({ id }) => id === newMainContactId);

        setNewMainContact({
            id: newMainContactId,
            message: `${translations.mainContact}
                ${pathOr('', ['firstName'], mainContact)} ${pathOr('', ['lastName'], mainContact)}
                ${translations.willBeChange} ${pathOr('', ['firstName'], contact)} ${pathOr('', ['lastName'], contact)}`,
        });
    };

    const updateMainContact = () => {
        newMainContact && updateSaleCard(saleId, { mainContactId: newMainContact.id });
        setNewMainContact(null);
    };

    const prepareData = rawContactList => {
        if (rawContactList) {
            return rawContactList.map(({
                id,
                firstName,
                lastName,
                position,
                email,
                personalEmail,
                socialNetwork,
                socialNetworkUser,
                skype,
                phone,
                country,
                sex,
                dateOfBirth,
            }) => ({
                id,
                fioAndPosition: [
                    `${firstName} ${lastName}`,
                    position,
                    sex,
                    id,
                    mainContactId,
                ],
                workEmailAndPrivateEmail: [email, personalEmail],
                socialNetworkAndSocialNetworlUser: [socialNetwork, socialNetworkUser, username],
                skypeAndPhone: [skype, phone],
                countryAndBirthday: [
                    { label: pathOr(null, ['name'], country), value: pathOr(null, ['id'], country) },
                    dateOfBirth,
                ],
                actions: [
                    id,
                    saveContactChange,
                    setEditContact,
                    setDeleteContactId,
                    changeMainContact,
                    mainContactId,
                ],
            }));
        }
        return [];
    };

    const hideConfirmationDeleteContact = () => setDeleteContactId(null);

    const onDeleteContact = () => {
        if (mainContactId === deleteContactId) {
            Notification.showMessage({
                message: translations.errorMainContactDelete,
                closeTimeout: 15000,
            });
            hideConfirmationDeleteContact();
        } else if (companyId && deleteContactId) {
            deleteOneContact(deleteContactId, companyId)
                .then(() => {
                    fetchSaleCard(saleId);
                    fetchActivities(saleId);
                });
            hideConfirmationDeleteContact();
        }
    };

    const availableToUser = userId === responsibleId;
    const disableEdit = isArchiveStatus(status) || !applyForUsers(availableToUser, roles);

    const updateEditRowState = (key, value) => {
        const contact = { ...editContact };

        if (key === FIO_KEY) {
            const [firstName, lastName] = value;

            contact.firstName = firstName;
            contact.lastName = lastName;
        } else {
            contact[key] = value;
        }

        setEditContact(contact);
    };

    const config = [
        {
            title: translations.fullNameOrPosition,
            key: 'fioAndPosition',
            visible: true,
            RenderCell: FioAndPositionCell,
        },
        {
            title: translations.email,
            key: 'workEmailAndPrivateEmail',
            visible: true,
            RenderCell: WorkEmailAndPrivateEmailCell,
        },
        {
            title: translations.socialNetworkOrVirtualProfile,
            key: 'socialNetworkAndSocialNetworlUser',
            visible: true,
            RenderCell: SocialNetworkAndSocialNetworlUserCell,
        },
        {
            title: translations.skypeOrPhone,
            key: 'skypeAndPhone',
            visible: true,
            RenderCell: SkypeAndPhoneCell,
        },
        {
            title: translations.birthdayOrCountry,
            key: 'countryAndBirthday',
            visible: true,
            RenderCell: CountryAndBirthdayCell,
        },
        {
            title: '',
            key: 'actions',
            visible: !disableEdit,
            RenderCell: ActionsCell,
        },
    ];

    return (
        <Paper
            elevation={0}
            classes={{ root: classes.root }}
        >
            <Grid
                item
                container
                direction='row'
                justify='space-between'
                alignItems='center'
                xs={12}
                className={classes.headerWrapper}
            >
                <Grid
                    item
                    container
                    justify='flex-start'
                    xs={6}
                >
                    <Typography className={classes.contactsCardLabel}>
                        {translations.contacts}
                    </Typography>
                </Grid>
                {!disableEdit
                    && <Grid
                        item
                        container
                        justify='flex-end'
                        xs={6}
                    >
                        <CRMButton
                            grey
                            component='span'
                            onClick={toggleModalVisibility}
                        >
                            {translations.add}
                            <Add fontSize='small' />
                        </CRMButton>
                    </Grid>
                }
            </Grid>
            <CRMTable
                data={prepareData(localContacts)}
                columnsConfig={config}
                isLoading={false}
                editableRowId={editContact.id}
                updateEditRowState={updateEditRowState}
                classes={{
                    root: cn(classes.tableContainer, {
                        [classes.mediumHeight]: contacts && contacts.length === 2,
                        [classes.bigHeight]: contacts && contacts.length >= 3,
                    }),
                    head: classes.head,
                    headerCell: classes.headerCell,
                    cell: classes.cell,
                    row: classes.row,
                }}
                cellClasses={{
                    fioAndPosition: classes.fioAndPosition,
                    workEmailAndPrivateEmail: classes.workEmailAndPrivateEmail,
                    skypeAndPhone: classes.skypeAndPhone,
                    countryAndBirthday: classes.countryAndBirthday,
                    actions: classes.actions,
                }}
            />
            <NewContactModal
                createOneContact={createOneContact}
                idCompany={companyId}
                closeModal={closeModal}
                handlerOpenOrCloseModal={toggleModalVisibility}
                isModalShow={modalIsShowed}
                sendRequest={sendRequest}
                setSendRequest={handlerSetSendRequest}
                saleMainContact={mainContact}
                saleId={saleId}
            />
            <CancelConfirmation
                showConfirmationDialog={!!deleteContactId}
                onConfirmationDialogClose={hideConfirmationDeleteContact}
                onConfirm={onDeleteContact}
                text={translations.notificationDeleteContact}
            />
            <CancelConfirmation
                showConfirmationDialog={!!newMainContact}
                onConfirmationDialogClose={() => setNewMainContact(null)}
                onConfirm={updateMainContact}
                text={pathOr('', ['message'], newMainContact)}
                textApply={translations.change}
                textCancel={translations.cancel}
            />
        </Paper>
    );
};

export default withStyles(styles)(ContactsCard);
