// @flow

import React, { useState, useEffect } from 'react';
import {
    Grid,
    Typography,
    IconButton,
    Tooltip,
} from '@material-ui/core';
import Download from '@material-ui/icons/GetApp';
import { withStyles } from '@material-ui/core/styles';
import { saveAs } from 'file-saver';

import { FULL_DATE_DS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import CRMIcon from 'crm-icons';
import { useTranslation } from 'crm-hooks/useTranslation';
import { getReports, downloadReport } from 'crm-api/reportByActivitiesService/reportService';
import CRMDateRangeInput from 'crm-components/common/CRMDateRangeInput/CRMDateRangeInput';
import { UserCell } from 'crm-components/common/TableCells';

import styles from './ReportByActivitiesPageStyle';

type Props = {
    classes: Object,
};

const ReportByActivitiesPage = ({
    classes,
}: Props) => {
    const [infoPage, setInfoPage] = useState([]);
    const [dateRange, setDateRange] = useState({
        from: subDays(new Date(), 1),
        to: subDays(new Date(), 1),
    });
    const [loading, setLoading] = useState(false);

    const translations = {
        title: useTranslation('reportByActivitiesPage.common.title'),
        downloadCSV: useTranslation('reportByActivitiesPage.common.downloadCSV'),
        employee: useTranslation('reportByActivitiesPage.common.employee'),
        calls: useTranslation('reportByActivitiesPage.common.calls'),
        socialNetwork: useTranslation('reportByActivitiesPage.common.socialNetwork'),
        mails: useTranslation('reportByActivitiesPage.common.mails'),
        meetings: useTranslation('reportByActivitiesPage.common.meetings'),
        interviews: useTranslation('reportByActivitiesPage.common.interviews'),
        allActivities: useTranslation('reportByActivitiesPage.common.allActivities'),
        requestsForCV: useTranslation('reportByActivitiesPage.common.requestsForCV'),
        requestsForEstimation: useTranslation('reportByActivitiesPage.common.requestsForEstimation'),
    };

    const fetchAll = async (params = dateRange) => {
        setLoading(true);

        const result = await getReports({
            from: getDate(startOfDay(params.from), FULL_DATE_DS),
            to: getDate(endOfDay(params.to), FULL_DATE_DS),
        });

        setInfoPage(result);
        setLoading(false);
    };

    useEffect(() => {
        document.title = translations.title;
        fetchAll();
    }, []);

    const prepareData = rowData => rowData.map(({
        sales,
        call,
        socialNetwork,
        email,
        meeting,
        interview,
        sum,
        resumeRequests,
        estimationRequests,
        salesId,
    }) => ({
        id: salesId,
        sales: { name: sales, id: salesId, reloadParent: fetchAll },
        call: call || '—',
        socialNetwork: socialNetwork || '—',
        email: email || '—',
        meeting: meeting || '—',
        interview: interview || '—',
        sum: sum || '—',
        resumeRequests: resumeRequests || '—',
        estimationRequests: estimationRequests || '—',
    }));

    const getConfig = () => [
        {
            title: translations.employee,
            key: 'sales',
            RenderCell: UserCell,
        },
        {
            title: translations.calls,
            key: 'call',
        },
        {
            title: translations.socialNetwork,
            key: 'socialNetwork',
        },
        {
            title: translations.mails,
            key: 'email',
        },
        {
            title: translations.meetings,
            key: 'meeting',
        },
        {
            title: translations.interviews,
            key: 'interview',
        },
        {
            title: translations.allActivities,
            key: 'sum',
        },
        {
            title: translations.requestsForCV,
            key: 'resumeRequests',
        },
        {
            title: translations.requestsForEstimation,
            key: 'estimationRequests',
        },
    ];

    const downloadCSV = async () => {
        const { from, to } = dateRange;
        const report = await downloadReport(
            getDate(startOfDay(from), FULL_DATE_DS),
            getDate(endOfDay(to), FULL_DATE_DS)
        );

        saveAs(new Blob([report]), 'reports_by_activities.csv');
    };

    const handleSelectRange = (from, to) => {
        if (from && to) {
            setDateRange({ from, to });
            fetchAll({ from, to });
        }
    };

    return (
        <Grid className={classes.container}>
            <Grid
                container
                className={classes.headerContainer}
                alignItems='center'
                justify='space-between'
            >
                <Typography className={classes.headerTitle}>
                    {translations.title}
                </Typography>
                <Grid
                    item
                    wrap='nowrap'
                    container
                    className={classes.filerWrapper}
                    alignItems='center'
                >
                    <CRMDateRangeInput
                        onSelectRange={handleSelectRange}
                        startDate={dateRange.from}
                        endDate={dateRange.to}
                        clearable={false}
                    />
                    <Tooltip
                        title={translations.downloadCSV}
                        interactive
                        placement='bottom-start'
                    >
                        <IconButton
                            onClick={downloadCSV}
                            className={classes.download}
                        >
                            <CRMIcon IconComponent={Download} />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <CRMTable
                data={prepareData(infoPage)}
                columnsConfig={getConfig()}
                isLoading={loading}
                loaderPosition='fixed'
                classes={{ root: classes.tableContainer }}
            />
        </Grid>
    );
};

export default withStyles(styles)(ReportByActivitiesPage);
