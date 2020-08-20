// @flow

import React, { useState, useEffect, useCallback } from 'react';
import {
    Paper,
    Grid,
    Typography,
} from '@material-ui/core';
import debounce from 'lodash.debounce';
import { isSameMinute, parseISO } from 'date-fns';
import { withStyles } from '@material-ui/core/styles';
import { getDate } from 'crm-utils/dates';
import { CRM_DATETIME_FORMAT_CAPITAL_MONTH } from 'crm-constants/dateFormat';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import { ROWS_PER_PAGE } from 'crm-constants/salePage/activitiesHistoryConstant';
import Notification from 'crm-components/notification/NotificationSingleton';
import { isArchiveStatus } from 'crm-utils/dataTransformers/sales/isSaleArchived';
import applyForUsers from 'crm-utils/sales/applyForUsers';
import NextActivityDateAdding from 'crm-components/NextActivityDateAdding';
import { CANCELED_REQUEST } from 'crm-constants/common/constants';
import { SALES, HEAD_SALES } from 'crm-roles';
import { UserCell } from 'crm-components/common/TableCells';
import {
    CommentCell,
    WithWhomCell,
    ActivityTypeCell,
    ActivityDateCell,
    ActionsCell,
} from './cells';

import type { addActivityArguments } from 'crm-api/desktopService/activityService';
import type { UpdateSalePayload } from 'crm-api/saleService';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './ActivitiesHistoryTableStyles';

type ContactsType = {
    id: number;
    firstName: string;
    lastName: string;
}

export type ActivityType = {
    type: string,
    typeEnumCode: string,
}

type ActivitiesType = {
    contacts: Array<ContactsType>;
    dateActivity: string;
    description: string;
    id: number;
    responsibleName: string;
    responsibleId: number,
    types: Array<ActivityType>;
};

type editActivitiesType = {
    contacts: Array<string>;
    dateActivity: string;
    description: string;
    id: number;
    responsibleName: string;
    responsibleId: number,
    types: Array<ActivityType>;
};

type updateActivityData = {
    contacts: Array<string>;
    dateActivity: string;
    description: string;
    id?: number;
    responsibleName?: string;
    types: Array<string>;
}

type Props = {
    classes: Object;
    fetchActivities: (saleId: number, size: number, page: number) => void;
    fetchActivitiesTypes: () => void;
    updateActivityTable:
        (activityId: number, data: updateActivityData, saleId: number, rowsPerPage: number, page: number) => void;
    deleteOneActivity: (activityId: number, saleId: number) => void;
    fetchSearchActivity: (searchData: string, saleId: number, size: number, canceled?: boolean) => void;
    activities: Array<ActivitiesType>;
    typesActivity: Array<ActivityType>;
    saleId: number;
    activitiesCount: number;
    status: string;
    fetchSaleCard: (saleId: number) => void;
    isLoading: boolean;
    userData: {roles?: Array<string>, id: number},
    responsibleId?: number,
    contactsList: Array<ContactsType>,
    companyId: number,
    mainContactId: number,
    addActivity: (data: addActivityArguments) => void,
    updateSaleCard: (id: number, editSaleBody: UpdateSalePayload) => void,
};

const ActivitiesHistoryTable = ({
    saleId,
    fetchActivitiesTypes,
    fetchActivities,
    deleteOneActivity,
    fetchSaleCard,
    classes,
    fetchSearchActivity,
    isLoading,
    activities,
    activitiesCount = 0,
    contactsList,
    typesActivity: activityTypesList,
    updateActivityTable,
    userData: { roles: userRoles, id: userId },
    responsibleId,
    status,
    companyId,
    mainContactId,
    addActivity,
    updateSaleCard,
}: Props) => {
    const [searchValue, setSearchValue] = useState('');
    const [page, setPage] = useState(0);
    const [editActivity, setEditActivity]: [editActivitiesType, Function] = useState({});
    const [deleteActivityId, setDeleteActivityId] = useState(null);

    const translations = {
        messageActivityDateStart: useTranslation('sale.workLogSection.messageActivityDateStart'),
        messageActivityDateEnd: useTranslation('sale.workLogSection.messageActivityDateEnd'),
        comments: useTranslation('sale.workLogSection.comments'),
        manager: useTranslation('sale.workLogSection.manager'),
        contact: useTranslation('sale.workLogSection.contact'),
        typeActivity: useTranslation('sale.workLogSection.typeActivity'),
        dateActivity: useTranslation('sale.workLogSection.dateActivity'),
        workLog: useTranslation('sale.workLogSection.workLog'),
        noResultsFound: useTranslation('sale.workLogSection.noResultsFound'),
        search: useTranslation('common.search'),
        notificationDeleteAddingActivity: useTranslation('sale.workLogSection.notificationDeleteAddingActivity'),
    };

    const getActivites = () => fetchActivities(saleId, ROWS_PER_PAGE, page);

    const searchSales = useCallback(debounce((param: string) => fetchSearchActivity(param, saleId, 150, CANCELED_REQUEST), 100), []);

    useEffect(() => {
        (async () => {
            getActivites();
            fetchActivitiesTypes();
        })();
    }, []);

    const addActivityHandler = async (data: addActivityArguments) => {
        await addActivity(data);

        setPage(0);
        fetchActivities(saleId, ROWS_PER_PAGE, 0);
    };

    const handleChangePage = (newPage: number) => {
        setPage(newPage);

        fetchActivities(saleId, ROWS_PER_PAGE, newPage);
    };

    const changeSearchValue = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        setSearchValue(value);
        setPage(0);

        searchSales(value);
    };

    const clearSearchValue = () => {
        setSearchValue('');
        getActivites();
    };

    const hideConfirmationDeleteContact = () => setDeleteActivityId(null);

    const onDeleteActivity = async () => {
        if (deleteActivityId && saleId) {
            await deleteOneActivity(deleteActivityId, saleId);

            fetchSaleCard(saleId);
            hideConfirmationDeleteContact();
        }
    };

    const updateEditRowState = (key, value) => setEditActivity({ ...editActivity, [key]: value });

    const onEditActivity = activityId => () => {
        const editedActivity = activities.find(({ id }) => id === activityId);

        if (editedActivity) {
            const { contacts, dateActivity, description, types } = editedActivity;

            setEditActivity({
                id: activityId,
                contacts: contacts.map(contact => contact.id),
                dateActivity,
                description,
                types,
            });
        }
    };

    const checkActivitiesSomeDate = dateActivity => {
        const activitiesWithoutCurrent = activities.filter(({ id }) => id !== editActivity.id);

        if (!dateActivity) {
            return;
        }

        if (activitiesWithoutCurrent.some(
            activity => isSameMinute(parseISO(activity.dateActivity), parseISO(dateActivity))
        )) {
            Notification.showMessage({
                message: `${translations.messageActivityDateStart}
                    ${getDate(dateActivity, CRM_DATETIME_FORMAT_CAPITAL_MONTH)}
                    ${translations.messageActivityDateEnd}`,
                type: 'warning',
                closeTimeout: 15000,
            });
        }
    };

    const updateActivities = () => {
        getActivites();
        fetchSaleCard(saleId);
    };

    const saveActiveChange = async () => {
        const { contacts = [], dateActivity = '', description = '', types = [] } = editActivity;
        const hasError = contacts instanceof Error
            || dateActivity instanceof Error
            || description instanceof Error
            || types instanceof Error;

        if (!hasError && saleId && editActivity.id) {
            const transformedData = {
                contacts,
                dateActivity,
                description,
                types: editActivity.types.map(({ typeEnumCode }) => typeEnumCode),
            };

            await updateActivityTable(editActivity.id, transformedData, saleId, ROWS_PER_PAGE, page);

            checkActivitiesSomeDate(dateActivity);
            setEditActivity({});
        }
    };

    const config = [
        {
            title: translations.comments,
            key: 'description',
            visible: true,
            RenderCell: CommentCell,
        },
        {
            title: translations.manager,
            key: 'responsible',
            visible: true,
            RenderCell: UserCell,
        },
        {
            title: translations.contact,
            key: 'contacts',
            visible: true,
            RenderCell: WithWhomCell,
        },
        {
            title: translations.typeActivity,
            key: 'types',
            visible: true,
            RenderCell: ActivityTypeCell,
        },
        {
            title: translations.dateActivity,
            key: 'dateActivity',
            visible: true,
            RenderCell: ActivityDateCell,
        },
        {
            title: '',
            key: 'actions',
            visible: true,
            RenderCell: ActionsCell,
        },
    ];

    const checkDisabledActions = () => !applyForUsers(userId === responsibleId, userRoles)
            || isArchiveStatus(status);

    const prepareData = rawActivitiesData => rawActivitiesData.map(({
        id,
        description,
        responsibleName,
        responsibleId: responsibleUserId,
        contacts,
        types,
        dateActivity,
    }) => ({
        id,
        description,
        responsible: { name: responsibleName, id: responsibleUserId, reloadParent: updateActivities },
        contacts: [contacts, contactsList],
        types: [types, activityTypesList],
        dateActivity,
        actions: [id, setEditActivity, onEditActivity, saveActiveChange, setDeleteActivityId, checkDisabledActions()],
    }));

    return (
        <Paper
            elevation={0}
            className={classes.wrapTable}
            classes={{ root: classes.root }}
        >
            <Grid
                item
                container
                direction='row'
                justify='space-between'
                alignItems='center'
                className={classes.headerWrapper}
                xs={12}
            >
                <Grid item xs={3}>
                    <Typography>
                        {translations.workLog}
                    </Typography>
                </Grid>
                <Grid
                    item
                    container
                    direction='row'
                    justify='flex-end'
                    alignItems='center'
                    xs={9}
                >
                    <Grid
                        item
                        className={classes.search}
                    >
                        <CRMInput
                            placeholder={translations.search}
                            onChange={changeSearchValue}
                            onClear={clearSearchValue}
                            searchable
                            fullWidth
                            value={searchValue}
                        />
                    </Grid>
                    {(userRoles && (userRoles.includes(HEAD_SALES) || userRoles.includes(SALES))) && (
                        <Grid item>
                            <NextActivityDateAdding
                                isUseInSalePage
                                company={companyId}
                                companySaleId={saleId}
                                addActivity={addActivityHandler}
                                editSale={updateSaleCard}
                                mainContactId={mainContactId}
                            />
                        </Grid>
                    )}
                </Grid>
            </Grid>
            <CRMTable
                data={prepareData(activities)}
                columnsConfig={config}
                isLoading={isLoading}
                editableRowId={editActivity.id}
                updateEditRowState={updateEditRowState}
                paginationParams={{
                    rowsPerPage: ROWS_PER_PAGE,
                    page,
                    count: activitiesCount,
                    onChangePage: handleChangePage,
                }}
                classes={{
                    row: classes.row,
                    cell: classes.cell,
                    head: classes.head,
                    headerCell: classes.headerCell,
                }}
                cellClasses={{
                    description: classes.description,
                    responsible: classes.responsible,
                    contacts: classes.contacts,
                    types: classes.types,
                    dateActivity: classes.dateActivity,
                    actions: classes.actions,
                }}
                noResultsFoundText={translations.noResultsFound}
            />
            <CancelConfirmation
                showConfirmationDialog={!!deleteActivityId}
                onConfirmationDialogClose={hideConfirmationDeleteContact}
                onConfirm={onDeleteActivity}
                text={translations.notificationDeleteAddingActivity}
            />
        </Paper>
    );
};

export default withStyles(styles)(ActivitiesHistoryTable);
