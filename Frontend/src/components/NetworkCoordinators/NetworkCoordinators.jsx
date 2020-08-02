// @flow

import React, { useEffect, useState } from 'react';
import {
    Paper,
    Grid,
    Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import { useTranslation } from 'crm-hooks/useTranslation';
import { getSocialAnswerRating } from 'crm-api/socialAnswerService/socialAnswerService';
import { UserCell } from 'crm-components/common/TableCells';

import styles from './NetworkCoordinatorsStyles';

type Props = {
    classes: Object,
};

export const PAGE_SIZE = 50;

const NetworkCoordinators = ({
    classes,
}: Props) => {
    const [raiting, setRaiting] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [localTotalElements, setLocalTotalElements] = useState(0);
    const [sort, setSort] = useState('amount,desc');

    const translations = {
        ratingsOfNC: useTranslation('ratingsNC.ratingsOfNC'),
        nc: useTranslation('ratingsNC.nc'),
        totalReplies: useTranslation('ratingsNC.totalReplies'),
        accepted: useTranslation('ratingsNC.accepted'),
    };

    const fetchAll = async (pageParams: number = page, sortParams: string = sort) => {
        setLoading(true);

        const { content, totalElements } = await getSocialAnswerRating(pageParams, sortParams);

        setLoading(false);
        setLocalTotalElements(totalElements);
        setRaiting(content);
    };

    useEffect(() => {
        fetchAll(page, sort);
    }, []);

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
        fetchAll(newPage, sort);
    };

    const changeSorting = (newSort: string) => {
        setSort(newSort);
        fetchAll(page, newSort);
    };

    const config = [
        {
            title: '№',
            key: 'number',
        },
        {
            title: translations.nc,
            key: 'assistant',
            RenderCell: UserCell,
        },
        {
            title: translations.totalReplies,
            key: 'amount',
            sortingParams: {
                changeSorting,
                sort,
            },
        },
        {
            title: translations.accepted,
            key: 'apply',
            sortingParams: {
                changeSorting,
                sort,
            },
        },
    ];

    const prepareData = rawData => rawData.map(({
        amount,
        apply,
        assistantId,
        assistantName,
    }, index) => ({
        id: assistantId,
        number: (PAGE_SIZE * page) + index + 1,
        assistant: { name: assistantName, id: assistantId, reloadParent: fetchAll },
        amount: amount || '',
        apply: apply || '',
    }));

    return (
        <Paper
            elevation={0}
            className={classes.container}
            classes={{ rounded: classes.rounded }}
        >
            <Grid>
                <Typography className={classes.title}>
                    {translations.ratingsOfNC}
                </Typography>
                <CRMTable
                    data={prepareData(raiting)}
                    columnsConfig={config}
                    isLoading={loading}
                    paginationParams={{
                        rowsPerPage: PAGE_SIZE,
                        count: localTotalElements,
                        onChangePage: handleChangePage,
                        page,
                    }}
                    classes={{
                        root: classes.tableRoot,
                        cell: classes.cell,
                        head: classes.head,
                        headerCell: classes.headerCell,
                        title: classes.headTitle,
                    }}
                />
            </Grid>
        </Paper>

    );
};

export default withStyles(styles)(NetworkCoordinators);
