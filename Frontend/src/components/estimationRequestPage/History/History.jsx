// @flow

import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { getDate } from 'crm-utils/dates';
import { useTranslation } from 'crm-hooks/useTranslation';
import { pathOr } from 'ramda';
import {
    Grid,
    Typography,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import { UserCell } from 'crm-components/common/TableCells';
import { HISTORY_ROW_PER_PAGE, TABLE_COLUMN_KEYS } from 'crm-constants/estimationRequestPage/historyConstants';
import { CRM_DATETIME_FORMAT_DOTS } from 'crm-constants/dateFormat';
import type { HistoryType } from 'crm-types/estimationRequests';

import styles from 'crm-components/common/Request/RequestHistoryStyles';

type Props = {
    classes: Object,
    estimationId: number,
    fetchHistory: (id: number, size?: number, page?: number) => Promise<void>,
    eventHistory: Array<HistoryType>,
    loading: boolean,
    totalElements: number,
    resetPage: boolean,
}

const History = ({
    classes,
    estimationId,
    fetchHistory,
    eventHistory,
    loading,
    totalElements,
    resetPage,
}: Props) => {
    const [page, setPage] = useState(0);
    const [expanded, setExpanded] = useState(false);

    const translations = {
        activityLog: useTranslation('requestForEstimation.activityLogSection.activityLog'),
        activity: useTranslation('requestForEstimation.activityLogSection.activity'),
        userName: useTranslation('requestForEstimation.activityLogSection.userName'),
        dateOfEditing: useTranslation('requestForEstimation.activityLogSection.dateOfEditing'),
        show: useTranslation('common.show'),
        hide: useTranslation('common.hide'),
    };

    const getHistory = () => {
        fetchHistory(estimationId, HISTORY_ROW_PER_PAGE, page);
    };

    useEffect(() => {
        getHistory();
    }, []);

    useEffect(() => {
        resetPage && setPage(0);
    });

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
        fetchHistory(estimationId, HISTORY_ROW_PER_PAGE, newPage);
    };

    const toogleExpanded = () => setExpanded(!expanded);

    const renderTable = () => {
        const prepareData = rawEventHistory => rawEventHistory.map(({
            id,
            description,
            employee,
            createDate,
        }) => ({
            id,
            description,
            employee: {
                name: `${pathOr('', ['firstName'], employee)} ${pathOr('', ['lastName'], employee)}`,
                id: pathOr(null, ['id'], employee),
                reloadParent: getHistory,
            },
            date: getDate(createDate, CRM_DATETIME_FORMAT_DOTS),
        }));

        const config = [
            {
                title: translations.activity,
                key: TABLE_COLUMN_KEYS.DESCRIPTION,
                visible: true,
            },
            {
                title: translations.userName,
                key: TABLE_COLUMN_KEYS.EMPLOYEE,
                visible: true,
                RenderCell: UserCell,
            },
            {
                title: translations.dateOfEditing,
                key: TABLE_COLUMN_KEYS.CHANGE_DATE,
                visible: true,
            },
        ];

        return (
            <CRMTable
                data={prepareData(eventHistory)}
                columnsConfig={config}
                rowHover
                paginationParams={{
                    rowsPerPage: HISTORY_ROW_PER_PAGE,
                    count: totalElements,
                    onChangePage: handleChangePage,
                    page,
                }}
                isLoading={loading}
                classes={{ title: classes.title }}
                cellClasses={{
                    description: classes.description,
                    date: classes.date,
                }}
            />
        );
    };

    return (
        <ExpansionPanel
            elevation={0}
            expanded={expanded}
            onChange={toogleExpanded}
            classes={{ root: classes.root }}
        >
            <ExpansionPanelSummary
                classes={{
                    root: classes.panelHeader,
                    content: classes.panelHeaderContent,
                }}
            >
                <Grid
                    container
                    justify='flex-start'
                    alignItems='center'
                >
                    <Typography className={classes.headerTitle}>
                        {translations.activityLog}
                    </Typography>
                    <Typography className={classes.expanded}>
                        {expanded ? translations.hide : translations.show}
                        <ArrowDropDown className={cn(classes.dropDownIcon, { [classes.closeIcon]: expanded })} />
                    </Typography>
                </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails classes={{ root: classes.panelContent }}>
                {renderTable()}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
};

export default withStyles(styles)(History);
