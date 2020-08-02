// @flow

import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { pathOr } from 'ramda';
import {
    Grid,
    Typography,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { fetchHistory } from 'crm-api/resumeRequestService/historyService';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import { HISTORY_ROW_PER_PAGE } from 'crm-constants/resumeRequestPage/historyConstants';
import { CRM_DATETIME_FORMAT_DOTS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import { useTranslation } from 'crm-hooks/useTranslation';
import { UserCell } from 'crm-components/common/TableCells';

import styles from 'crm-components/common/Request/RequestHistoryStyles';

type Props = {
    classes: Object,
    requestResumeId: number,
    isUpdateHistoryNecessary: boolean,
    setUpdateHistory: (value: boolean) => void,
}

const History = ({
    classes,
    requestResumeId,
    isUpdateHistoryNecessary,
    setUpdateHistory,
}: Props) => {
    const [page, setPage] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [eventHistory, setEventHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0);

    const translations = {
        activityLog: useTranslation('requestForCv.activityLogSection.activityLog'),
        activity: useTranslation('requestForCv.activityLogSection.activity'),
        userName: useTranslation('requestForCv.activityLogSection.userName'),
        dateOfEditing: useTranslation('requestForCv.activityLogSection.dateOfEditing'),
        show: useTranslation('common.show'),
        hide: useTranslation('common.hide'),
    };

    const getHistory = async () => {
        setLoading(true);

        const { content, totalElements: newTotalElemets } = await fetchHistory(requestResumeId, page);

        setLoading(false);
        setEventHistory(content);
        setTotalElements(newTotalElemets);
    };

    useEffect(() => {
        getHistory();
    }, [page]);

    useEffect(() => {
        (async () => {
            if (isUpdateHistoryNecessary) {
                await getHistory();

                setUpdateHistory(false);
            }
        })();
    }, [isUpdateHistoryNecessary]);

    const toogleExpanded = () => setExpanded(!expanded);

    const prepareData = rawEventHistory => rawEventHistory.map(({
        id,
        description,
        employee,
        date,
    }) => ({
        id,
        description,
        employee: {
            name: `${pathOr('', ['firstName'], employee)} ${pathOr('', ['lastName'], employee)}`,
            id: pathOr(null, ['id'], employee),
            reloadParent: getHistory,
        },
        date: getDate(date, CRM_DATETIME_FORMAT_DOTS),
    }));

    const config = [
        {
            title: translations.activity,
            key: 'description',
            visible: true,
        },
        {
            title: translations.userName,
            key: 'employee',
            visible: true,
            RenderCell: UserCell,
        },
        {
            title: translations.dateOfEditing,
            key: 'date',
            visible: true,
        },
    ];

    const handleChangePage = (newPage: number) => setPage(newPage);

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
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
};

export default withStyles(styles)(History);
