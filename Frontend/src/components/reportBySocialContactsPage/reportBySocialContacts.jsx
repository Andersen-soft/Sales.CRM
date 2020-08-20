// @flow

import React, { useState, useEffect, useRef } from 'react';
import { isNil, pathOr } from 'ramda';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import CRMInputSearch from 'crm-ui/CRMInput/CRMInput';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import Notification from 'crm-components/notification/NotificationSingleton';
import { getDate } from 'crm-utils/dates';
import {
    checkActiveColumnsVersion,
    transformDataBeforeSave,
    checkInstanceErrors,
} from 'crm-utils/SocialContacts/SocialContactsUtils';
import {
    fetchSocialContactsForSale,
    rejectSocialAnswer,
    updateSocialAnswerByID,
    applySocialAnswer,
} from 'crm-api/reportBySocialContactsSales/reportBySocialContactsSales';
import {
    CONTACTS_STATUS,
    PAGE_SIZE,
    SocialContactsHeaders,
    SOCIAL_CONTACTS_COLUMNS,
} from 'crm-constants/reportBySocialContactsPage/socialContactsConstants';
import { CRM_DATETIME_FORMAT_DOTS } from 'crm-constants/dateFormat';
import { KEY_ENTER, KEY_BACKSPACE } from 'crm-constants/keyCodes';
import { useTranslation } from 'crm-hooks/useTranslation';
import { ALLOWED_PHONE_SYMBOLS, EMAIL_REGEXP } from 'crm-constants/validationRegexps/validationRegexps';
import { crmTrim } from 'crm-utils/trimValue';
import { UserCell } from 'crm-components/common/TableCells';
import {
    HeaderActionsCell,
    Actions,
    Message,
    SocialNetwork,
    InputCell,
    Gender,
    Country,
    Company,
    CompanySite,
    CompanyPhone,
    BirthdayCell,
} from './cells';
import ReportSettings from 'crm-components/common/ReportSettings';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './reportBySocialContactsStyles';

export type SocialAnswer = {
    assistant: {
        id: number,
        firstName: string,
        lastName: string,
        responsibleRm: ?number,
    },
    company: {
        id: number,
        name: string,
        phone: ?string,
        site: ?string,
    },
    country: {
        id: number,
        name: string,
    },
    created: string,
    email: ?string,
    emailPrivate: ?string,
    firstName: string,
    id: number,
    lastName: string,
    linkLead: string,
    message: string,
    phone: ?string,
    position: ?string,
    responsible: {
        id: number,
        firstName: string,
        lastName: string,
        responsibleRm: ?number,
    },
    sex: string,
    skype: ?string,
    source: {
        id: number,
        name: string,
        type: ?string,
    },
    dateOfBirth: string,
};

type Props = {
    classes: Object,
    userData: { id: number },
} & StyledComponentProps;

const reportBySocialContacts = ({
    classes,
    userData: { id: userId },
}: Props) => {
    checkActiveColumnsVersion();

    const SETTINGS = localStorage.getItem(SOCIAL_CONTACTS_COLUMNS);

    const [settings, setSettings] = useState(SETTINGS ? JSON.parse(SETTINGS) : SocialContactsHeaders);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [socialNetworkAnswers, setsocialNetworkAnswers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editRowId, setEditRowId] = useState(null);
    const [editedComapny, setEditedCompany] = useState(null);
    const [checkedRows, setCheckedRows] = useState({ '0': [] });
    const [checkedSingleRow, setCheckedSingleRow] = useState(null);

    const editRow = useRef({});

    const translations = {
        dateOfCreation: useTranslation('socialNetworksReplies.columns.dateOfCreation'),
        message: useTranslation('socialNetworksReplies.columns.message'),
        socialNetwork: useTranslation('socialNetworksReplies.columns.socialNetwork'),
        virtualProfile: useTranslation('socialNetworksReplies.columns.virtualProfile'),
        coordinator: useTranslation('socialNetworksReplies.columns.coordinator'),
        sources: useTranslation('socialNetworksReplies.columns.sources'),
        name: useTranslation('socialNetworksReplies.columns.name'),
        surname: useTranslation('socialNetworksReplies.columns.surname'),
        gender: useTranslation('socialNetworksReplies.columns.gender'),
        position: useTranslation('socialNetworksReplies.columns.position'),
        country: useTranslation('socialNetworksReplies.columns.country'),
        skype: useTranslation('socialNetworksReplies.columns.skype'),
        emailCorp: useTranslation('socialNetworksReplies.columns.emailCorp'),
        emailPers: useTranslation('socialNetworksReplies.columns.emailPers'),
        phoneNumberPers: useTranslation('socialNetworksReplies.columns.phoneNumberPers'),
        company: useTranslation('socialNetworksReplies.columns.company'),
        companySite: useTranslation('socialNetworksReplies.columns.companySite'),
        phoneNumberComp: useTranslation('socialNetworksReplies.columns.phoneNumberComp'),
        title: useTranslation('socialNetworksReplies.common.title'),
        notificationRejectedReplies: useTranslation('socialNetworksReplies.notification.notificationRejectedReplies'),
        notificationRejectedReply: useTranslation('socialNetworksReplies.notification.notificationRejectedReply'),
        notificationDataNotProcessed: useTranslation('socialNetworksReplies.notification.notificationDataNotProcessed'),
        notificationConfirmRejectedReplies: useTranslation('socialNetworksReplies.notification.notificationConfirmRejectedReplies'),
        notificationConfirmRejectedReply: useTranslation('socialNetworksReplies.notification.notificationConfirmRejectedReply'),
        notificationObjectCreated: useTranslation('socialNetworksReplies.notification.notificationObjectCreated'),
        notificationObjectsCreated: useTranslation('socialNetworksReplies.notification.notificationObjectsCreated'),
        search: useTranslation('common.search'),
        cancel: useTranslation('common.cancel'),
        confirm: useTranslation('common.confirm'),
        dateOfBirth: useTranslation('socialNetworksReplies.common.dateOfBirth'),
    };

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
        fetchAll(searchValue, newPage);
    };

    // TODO: Function Declaration для фикса SonarQube (handleChangePage и fetchAll вызывают друг друга)
    async function fetchAll(value, newPage) {
        setLoading(true);
        const { content, totalElements: newTotalElements } = await fetchSocialContactsForSale({
            search: isNil(value) ? searchValue : value,
            page: isNil(newPage) ? page : newPage,
            status: CONTACTS_STATUS,
            currentUserId: userId,
        });

        setLoading(false);
        setTotalElements(newTotalElements);
        setsocialNetworkAnswers(content);

        if (page > 0 && !content.length) {
            handleChangePage(page - 1);
        }
    }

    useEffect(() => {
        document.title = translations.title;
        fetchAll(searchValue);
    }, []);

    const handleChangeColumnVisibility = key => {
        const settingsCopy = { ...settings, columnsVisible: { ...settings.columnsVisible } };

        settingsCopy.columnsVisible[key] = !settingsCopy.columnsVisible[key];

        setSettings(settingsCopy);
        localStorage.setItem(SOCIAL_CONTACTS_COLUMNS, JSON.stringify(settingsCopy));
    };

    const handleEditRow = answerId => {
        const editableRow = socialNetworkAnswers.find(({ id }) => id === answerId);

        if (editableRow) {
            editRow.current = editableRow;
            setEditRowId(answerId);
            setEditedCompany(editableRow.company);
        }
    };

    const handleCloseEdit = () => {
        editRow.current = {};
        setEditRowId(null);
        setEditedCompany(null);
    };

    const updateEditRowState = (key, value) => {
        if (key === 'company') {
            setEditedCompany(value instanceof Error ? {} : value);
        }

        if (editRow.current[key] !== value) {
            editRow.current = { ...editRow.current, [key]: value };
        }
    };

    const saveRow = async () => {
        const hasCompanyError = checkInstanceErrors(editRow.current.company);
        const hasError = checkInstanceErrors(editRow.current);

        if (!hasError && !hasCompanyError && editRowId) {
            const transformedData = transformDataBeforeSave(editRow.current);

            setLoading(true);
            try {
                await updateSocialAnswerByID(editRowId, transformedData);
                setLoading(false);

                await fetchAll(searchValue);
                editRow.current = {};
                setEditRowId(null);
                setEditedCompany(null);
            } catch (error) {
                setLoading(false);
                Notification.showMessage({
                    message: pathOr(translations.notificationDataNotProcessed, ['response', 'data', 'errorMessage'], error),
                    closeTimeout: 15000,
                });
            }
        }
    };

    const getCheckedRowsForPage = () => checkedRows[page] ? checkedRows[page] : [];

    const getCheckedRowsForAllPages = () => Object.values(checkedRows).flatMap(value => value);

    const getMessageForDeleteDialog = () => {
        const checkedRowsRelevant = checkedSingleRow ? [checkedSingleRow] : getCheckedRowsForAllPages();

        return (checkedSingleRow || checkedRowsRelevant.length === 1)
            ? translations.notificationConfirmRejectedReply
            : translations.notificationConfirmRejectedReplies;
    };

    const updateCheckedRows = ({ id, items }) => {
        if (items[page]) {
            const checkedIds = items[page];

            return checkedIds.includes(id)
                ? checkedIds.filter(item => item !== id)
                : [...checkedIds, id];
        }
        return [id];
    };

    const handleCheckedRow = id => {
        setCheckedRows(items => ({
            ...items,
            ...{ [page]: updateCheckedRows({ id, items }) },
        }));
    };

    const handleCheckedAllRows = () => {
        setCheckedRows(items => {
            if (items[page]) {
                const checkedIds = items[page];

                if (checkedIds.length > 0) {
                    return {
                        ...items,
                        ...{ [page]: [] },
                    };
                }
            }

            const ids = socialNetworkAnswers
                .map(({ id }) => id)
                .filter(id => editRowId ? (id !== editRowId) : id);

            return {
                ...items,
                ...{ [page]: ids },
            };
        });
    };

    const handleDeleteRow = id => {
        setCheckedSingleRow(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteAllRows = async () => {
        setIsDeleteDialogOpen(false);

        try {
            const checkedRowsRelevant = checkedSingleRow ? [checkedSingleRow] : getCheckedRowsForAllPages();
            const message = (checkedSingleRow || checkedRowsRelevant.length === 1)
                ? translations.notificationRejectedReply
                : translations.notificationRejectedReplies;

            await rejectSocialAnswer(checkedRowsRelevant);

            setCheckedSingleRow(null);
            setCheckedRows({ '0': [] });
            fetchAll('');

            Notification.showMessage({
                message,
                type: 'success',
                closeTimeout: 15000,
            });
        } catch (error) {
            Notification.showMessage({
                message: translations.notificationDataNotProcessed,
                closeTimeout: 15000,
            });
        }
    };

    const handleSaveAllRows = async idSingleRow => {
        try {
            const checkedRowsRelevant = idSingleRow ? [idSingleRow] : getCheckedRowsForAllPages();
            const message = (idSingleRow || checkedRowsRelevant.length === 1)
                ? translations.notificationObjectCreated
                : translations.notificationObjectsCreated;

            await applySocialAnswer(checkedRowsRelevant);

            setCheckedRows({ '0': [] });
            fetchAll('');

            Notification.showMessage({
                message,
                type: 'success',
                closeTimeout: 15000,
            });
        } catch (error) {
            Notification.showMessage({
                message: translations.notificationDataNotProcessed,
                closeTimeout: 15000,
            });
        }
    };

    const prepareData = rowData => rowData.map(({
        id,
        created,
        message,
        linkLead,
        contact,
        assistant,
        source,
        firstName,
        lastName,
        sex,
        position,
        country,
        skype,
        email,
        emailPrivate,
        phone,
        company,
        dateOfBirth,
    }) => ({
        actions: [
            id,
            handleDeleteRow,
            handleEditRow,
            handleCloseEdit,
            saveRow,
            handleCheckedRow,
            getCheckedRowsForPage(),
            handleSaveAllRows,
        ],
        id,
        created: getDate(created, CRM_DATETIME_FORMAT_DOTS),
        message,
        linkLead,
        virtualContact: contact.name,
        coordinator: {
            id: assistant.id,
            name: `${assistant.firstName} ${assistant.lastName}`,
            reloadParent: fetchAll,
        },
        source: source.name,
        firstName: [firstName, 'firstName', true],
        lastName: [lastName, 'lastName', true],
        sex,
        position: [position, 'position', false],
        country: { label: country.name, value: country.id },
        skype: [skype, 'skype', false],
        email: [email, 'email', false, EMAIL_REGEXP],
        emailPrivate: [emailPrivate, 'emailPrivate', false, EMAIL_REGEXP],
        phone: [phone, 'phone', false, ALLOWED_PHONE_SYMBOLS],
        company: [company, editedComapny],
        site: [company, editedComapny],
        companyPhone: [company, editedComapny],
        dateOfBirth,
    }));

    const getConfig = () => {
        const columnsConfig = [
            {
                title: <HeaderActionsCell
                    onHandleSave={() => handleSaveAllRows()}
                    onHandleDelete={() => setIsDeleteDialogOpen(true)}
                    onHandleChecked={handleCheckedAllRows}
                    checkedRowsIds={getCheckedRowsForPage()}
                    socialNetworkAnswers={socialNetworkAnswers}
                />,
                key: 'actions',
                RenderCell: Actions,
            },
            {
                title: translations.dateOfCreation,
                key: 'created',
            },
            {
                title: translations.message,
                key: 'message',
                RenderCell: Message,
            },
            {
                title: translations.socialNetwork,
                key: 'linkLead',
                RenderCell: SocialNetwork,
            },
            {
                title: translations.virtualProfile,
                key: 'virtualContact',
            },
            {
                title: translations.coordinator,
                key: 'coordinator',
                RenderCell: UserCell,
            },
            {
                title: translations.sources,
                key: 'source',
            },
            {
                title: translations.name,
                key: 'firstName',
                RenderCell: InputCell,
            },
            {
                title: translations.surname,
                key: 'lastName',
                RenderCell: InputCell,
            },
            {
                title: translations.dateOfBirth,
                key: 'dateOfBirth',
                RenderCell: BirthdayCell,
            },
            {
                title: translations.gender,
                key: 'sex',
                RenderCell: Gender,
            },
            {
                title: translations.position,
                key: 'position',
                RenderCell: InputCell,
            },
            {
                title: translations.country,
                key: 'country',
                RenderCell: Country,
            },
            {
                title: translations.skype,
                key: 'skype',
                RenderCell: InputCell,
            },
            {
                title: translations.emailCorp,
                key: 'email',
                RenderCell: InputCell,
            },
            {
                title: translations.emailPers,
                key: 'emailPrivate',
                RenderCell: InputCell,
            },
            {
                title: translations.phoneNumberPers,
                key: 'phone',
                RenderCell: InputCell,
            },
            {
                title: translations.company,
                key: 'company',
                RenderCell: Company,
            },
            {
                title: translations.companySite,
                key: 'site',
                RenderCell: CompanySite,
            },
            {
                title: translations.phoneNumberComp,
                key: 'companyPhone',
                RenderCell: CompanyPhone,
            },
        ];

        return columnsConfig.map(column => ({
            ...column,
            visible: settings.columnsVisible[column.key],
        }));
    };

    const isBackspacePress = (which, value) => which === KEY_BACKSPACE.which && !value.length;

    const changeSearchValue = ({ target: { value } }) => setSearchValue(value);

    const blurSearchValue = ({ target: { value } }) => setSearchValue(crmTrim(value));

    const clearSearchField = () => {
        setSearchValue('');
        fetchAll('');
    };

    const onKeyPress = ({ which }: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (which === KEY_ENTER.which || isBackspacePress(which, searchValue)) {
            setSearchValue(crmTrim(searchValue));
            fetchAll(crmTrim(searchValue));
        }
    };

    return (
        <Grid className={classes.container}>
            <Grid
                container
                className={classes.headerContainer}
                alignItems='center'
            >
                <Typography className={classes.headerTitle}>
                    {translations.title}
                </Typography>
                <Grid item className={classes.headerSearch}>
                    <CRMInputSearch
                        value={searchValue}
                        onChange={changeSearchValue}
                        onBlur={blurSearchValue}
                        onKeyPress={onKeyPress}
                        onClear={clearSearchField}
                        searchable
                        placeholder={translations.search}
                    />
                </Grid>
                <Grid item>
                    <ReportSettings
                        getColumnsConfig={getConfig}
                        handleChangeColumnVisibility={handleChangeColumnVisibility}
                    />
                </Grid>
            </Grid>
            <CRMTable
                data={prepareData(socialNetworkAnswers)}
                columnsConfig={getConfig()}
                editableRowId={editRowId}
                updateEditRowState={updateEditRowState}
                classes={{
                    root: classes.tableContainer,
                    cell: classes.tableCell,
                    head: classes.tableHead,
                    headerCell: classes.tableHeaderCell,
                    title: classes.tableTitle,
                }}
                paginationParams={{
                    rowsPerPage: PAGE_SIZE,
                    count: totalElements,
                    onChangePage: handleChangePage,
                    page,
                }}
                isLoading={loading}
                loaderPosition='fixed'
                cellClasses={{
                    message: classes.messages,
                    country: classes.country,
                    company: classes.company,
                    site: classes.site,
                    firstName: classes.firstName,
                    lastName: classes.lastName,
                    position: classes.position,
                    skype: classes.skype,
                    email: classes.email,
                    emailPrivate: classes.emailPrivate,
                }}
                checkedRowsIds={getCheckedRowsForPage()}
            />
            <CancelConfirmation
                showConfirmationDialog={isDeleteDialogOpen}
                onConfirmationDialogClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteAllRows}
                text={getMessageForDeleteDialog()}
                textCancel={translations.cancel}
                textApply={translations.confirm}
                classes={{ textAlignCenter: classes.dialogText }}
            />
        </Grid>
    );
};

export default withStyles(styles)(reportBySocialContacts);
