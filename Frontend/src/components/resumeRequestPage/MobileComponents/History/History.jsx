// @flow

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Grid, Typography, RootRef } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { fetchHistory } from 'crm-api/resumeRequestService/historyService';
import UserInformationPopover from 'crm-components/common/UserInformationPopover/UserInformationPopover';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { CRM_DATETIME_FORMAT_DOTS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import CRMPagination from 'crm-ui/CRMPagination/CRMPagination';
import { HISTORY_ROW_PER_PAGE } from 'crm-constants/resumeRequestPage/historyConstants';
import { useTranslation } from 'crm-hooks/useTranslation';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './HistoryStyles';

type Props = {
    requestId: number,
    isUpdateHistoryNecessary: boolean,
    setUpdateHistory: (value: boolean) => void,
    setLoading: (key: string, status: boolean) => void,
} & StyledComponentProps;

const LOADING_KEY = 'history';

const History = ({
    classes,
    requestId,
    isUpdateHistoryNecessary,
    setUpdateHistory,
    setLoading,
}: Props) => {
    const [page, setPage] = useState(0);
    const [eventHistory, setEventHistory] = useState([]);
    const [totalElements, setTotalElements] = useState(0);

    const contentWrapper = useRef(null);

    const translations = {
        activity: useTranslation('requestForCv.activityLogSection.activity'),
    };

    const scrollTop = () => {
        if (contentWrapper.current) {
            contentWrapper.current.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });
        }
    };

    const getHistory = async () => {
        setLoading(LOADING_KEY, true);

        const { content, totalElements: newTotalElemets } = await fetchHistory(requestId, page);

        setLoading(LOADING_KEY, false);
        setEventHistory(content);
        setTotalElements(newTotalElemets);
        scrollTop();
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


    return <RootRef rootRef={contentWrapper}>
        <Grid className={classes.container}>
            {eventHistory.map(({ id, description, employee, date }) => <Grid
                key={id}
                className={classes.historyItem}
            >
                <Typography className={classes.date}>{getDate(date, CRM_DATETIME_FORMAT_DOTS)}</Typography>
                {employee
                    ? <UserInformationPopover
                        userName={`${employee.firstName} ${employee.lastName}`}
                        userNameStyle={classes.userInformation}
                        userId={employee.id}
                        reloadParent={getHistory}
                    />
                    : <CRMEmptyBlock />}
                <Grid className={classes.event}>
                    <span className={classes.title}>{translations.activity}:</span>
                    <Typography className={classes.description}>{description}</Typography>
                </Grid>
            </Grid>)}
            {!!eventHistory && totalElements > HISTORY_ROW_PER_PAGE && <Paper className={classes.pagination}>
                <CRMPagination
                    rowsPerPage={HISTORY_ROW_PER_PAGE}
                    count={totalElements}
                    onChangePage={(newPage: number) => setPage(newPage)}
                    page={page}
                />
            </Paper>}
        </Grid>
    </RootRef>;
};

export default withStyles(styles)(History);
