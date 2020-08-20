// @flow

import React, { useEffect, useState } from 'react';
import {
    Paper,
    Grid,
    Typography,
    Tooltip,
    IconButton,
} from '@material-ui/core';
import { setDate } from 'date-fns';
import { withStyles } from '@material-ui/core/styles';
import { saveAs } from 'file-saver';
import Download from '@material-ui/icons/GetApp';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import { useTranslation } from 'crm-hooks/useTranslation';
import { getFullSocialAnswerRating, downloadReport } from 'crm-api/socialAnswerService/socialAnswerService';
import CRMIcon from 'crm-icons';
import CRMDateRangeInput from 'crm-components/common/CRMDateRangeInput/CRMDateRangeInput';
import { UserCell } from 'crm-components/common/TableCells';

import styles from './NetworkCoordinatorsSalesHeadStyles';

export type DateRange = {
    startDate: Date,
    endDate: Date,
}

type Props = {
    classes: Object,
};

export const PAGE_SIZE = 50;

const NetworkCoordinatorsSalesHead = ({
    classes,
}: Props) => {
    const [raiting, setRaiting] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [localTotalElements, setLocalTotalElements] = useState(0);
    const [sort, setSort] = useState('amount,desc');
    const [dateRange, setDateRange] = useState({ startDate: setDate(new Date(), 1), endDate: new Date() });

    const translations = {
        ratingsOfNC: useTranslation('ratingsNC.ratingsOfNC'),
        nc: useTranslation('ratingsNC.nc'),
        totalReplies: useTranslation('ratingsNC.totalReplies'),
        accepted: useTranslation('ratingsNC.accepted'),
        rejected: useTranslation('ratingsNC.rejected'),
        waiting: useTranslation('ratingsNC.waiting'),
        downloadCSV: useTranslation('ratingsNC.downloadCSV'),
    };

    const fetchAll = async (
        pageParams: number = page,
        sortParams: string = sort,
        dateRangeParams: DateRange = dateRange,
    ) => {
        setLoading(true);

        const { content, totalElements } = await getFullSocialAnswerRating(pageParams, sortParams, dateRangeParams);

        setLoading(false);
        setLocalTotalElements(totalElements);
        setRaiting(content);
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
        fetchAll(newPage);
    };

    const changeSorting = (newSort: string) => {
        setSort(newSort);
        fetchAll(page, newSort);
    };

    const handleDownloadReport = async () => {
        const file = await downloadReport(dateRange, sort);

        saveAs(new Blob([file]), 'networkCoordinatorsRatings.csv');
    };

    const handleSelectRange = (startDate, endDate) => {
        if (startDate && endDate) {
            setPage(0);
            setSort('amount,desc');
            setDateRange({ startDate, endDate });
            fetchAll(0, 'amount,desc', { startDate, endDate });
        }
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
        {
            title: translations.rejected,
            key: 'reject',
            sortingParams: {
                changeSorting,
                sort,
            },
        },
        {
            title: translations.waiting,
            key: 'waiting',
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
        reject,
        await: waiting,
    }, index) => ({
        id: assistantId,
        number: (PAGE_SIZE * page) + index + 1,
        assistant: { name: assistantName, id: assistantId, reloadParent: fetchAll },
        amount: amount || '',
        apply: apply || '',
        reject: reject || '',
        waiting: waiting || '',
    }));

    return (
        <Paper
            elevation={0}
            className={classes.container}
            classes={{ rounded: classes.rounded }}
        >
            <Grid>
                <Grid
                    container
                    justify='space-between'
                    alignItems='center'
                    wrap='nowrap'
                >
                    <Grid item xs={5}>
                        <Typography className={classes.title}>
                            {translations.ratingsOfNC}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        container
                        justify='flex-end'
                        xs={7}
                    >
                        <Grid
                            item
                            className={classes.dateItem}
                        >
                            <CRMDateRangeInput
                                onSelectRange={handleSelectRange}
                                startDate={dateRange.startDate}
                                endDate={dateRange.endDate}
                                clearable={false}
                            />
                        </Grid>
                        <Grid item>
                            <Tooltip
                                title={translations.downloadCSV}
                                interactive
                                placement='bottom-start'
                            >
                                <IconButton
                                    className={classes.iconButton}
                                    onClick={handleDownloadReport}
                                >
                                    <CRMIcon IconComponent={Download} />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
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

export default withStyles(styles)(NetworkCoordinatorsSalesHead);
