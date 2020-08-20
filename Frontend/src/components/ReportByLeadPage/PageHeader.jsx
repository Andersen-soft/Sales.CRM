// @flow

import React, { useState } from 'react';
import {
    Grid,
    IconButton,
    Tooltip,
    Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import InsertChartOutlinedOutlinedIcon from '@material-ui/icons/InsertChartOutlinedOutlined';
import Download from '@material-ui/icons/GetApp';
import { saveAs } from 'file-saver';
import { endOfDay, startOfDay } from 'date-fns';
import CRMIcon from 'crm-icons/CRMIcon';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMDateRangeInput from 'crm-components/common/CRMDateRangeInput/CRMDateRangeInput';
import CRMInputSearch from 'crm-ui/CRMInput/CRMInput';
import { KEY_ENTER } from 'crm-constants/keyCodes';
import ReportSettings from 'crm-components/common/ReportSettings';
import { HEAD_SALES } from 'crm-roles';
import { downloadReport } from 'crm-api/reportsByLeadService/reportService';
import { CRM_FULL_DATE_SERVER_FORMAT } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import StatisticModal from './SourceStatisticsModal';

import styles from './ReportByLeadPageStyles';

type Props = {
    dateRange: { from: Date, to: Date },
    handleChangeDateRange: (Date, Date) => void,
    search: string,
    handleChangeSearch: (string) => void,
    classes: Object,
    getConfig: () => Array<Object>,
    columnsVisible: Object,
    handleChangeColumnVisibility: (string) => void,
    userRoles: Array<string>,
    setIsDownload: (boolean) => void,
    filters: Object,
}

const PageHeader = ({
    classes,
    dateRange,
    handleChangeDateRange,
    search,
    handleChangeSearch,
    getConfig,
    columnsVisible,
    handleChangeColumnVisibility,
    userRoles,
    setIsDownload,
    filters,
}: Props) => {
    const [localSearch, setLocalSearch] = useState(search);
    const [showStatisticModal, setShowStatisticModal] = useState(false);

    const translations = {
        sourceStatistics: useTranslation('reportByLeadPage.sourceStatistics'),
        leadReport: useTranslation('reportByLeadPage.leadReport'),
        reportSettings: useTranslation('reportByLeadPage.reportSettings'),
        search: useTranslation('common.search'),
        downloadCSV: useTranslation('reportByLeadPage.downloadCSV'),
    };

    const changeSearchValue = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        setLocalSearch(value);
    };

    const onKeyPress = ({ key }: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (key === KEY_ENTER.key) {
            handleChangeSearch(localSearch.trim());
        }
    };

    const clearSearchField = () => {
        handleChangeSearch('');
        setLocalSearch('');
    };

    const handleDownloadReport = async () => {
        setIsDownload(true);

        const fileReport = await downloadReport(
            columnsVisible,
            {
                ...filters,
                search,
                from: getDate(startOfDay(dateRange.from), CRM_FULL_DATE_SERVER_FORMAT),
                to: getDate(endOfDay(dateRange.to), CRM_FULL_DATE_SERVER_FORMAT),
            });

        saveAs(new Blob([fileReport]), 'reports_by_lead.csv');
        setIsDownload(false);
    };

    return (
        <Grid
            container
            justify='space-between'
            alignItems='center'
            wrap='nowrap'
            className={classes.header}
        >
            <Grid item>
                <Typography className={classes.headerTitle}>
                    {translations.leadReport}
                </Typography>
            </Grid>
            <Grid
                item
                container
                justify='flex-end'
                alignItems='center'
            >
                <Grid
                    item
                    className={classes.dateItem}
                >
                    <CRMDateRangeInput
                        onSelectRange={handleChangeDateRange}
                        startDate={dateRange.from}
                        endDate={dateRange.to}
                        clearable={false}
                    />
                </Grid>
                <Grid
                    item
                    className={classes.headerItem}
                >
                    <CRMInputSearch
                        value={localSearch}
                        onChange={changeSearchValue}
                        onKeyPress={onKeyPress}
                        onClear={clearSearchField}
                        searchable
                        placeholder={translations.search}
                    />
                </Grid>
                <Grid
                    item
                    className={classes.headerIcon}
                >
                    <Tooltip
                        title={translations.sourceStatistics}
                        interactive
                        placement='bottom-start'
                    >
                        <IconButton
                            className={classes.iconButton}
                            onClick={() => setShowStatisticModal(true)}
                        >
                            <CRMIcon IconComponent={InsertChartOutlinedOutlinedIcon} />
                        </IconButton>
                    </Tooltip>
                </Grid>
                {userRoles.includes(HEAD_SALES)
                    && <Grid
                        item
                        className={classes.headerIcon}
                    >
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
                    </Grid>}
                <Grid
                    item
                    className={classes.headerIcon}
                >
                    <ReportSettings
                        getColumnsConfig={() => getConfig}
                        handleChangeColumnVisibility={handleChangeColumnVisibility}
                    />
                </Grid>
            </Grid>
            <StatisticModal
                open={showStatisticModal}
                toggleShow={() => setShowStatisticModal(state => !state)}
                dateRange={dateRange}
            />
        </Grid>
    );
};

export default withStyles(styles)(PageHeader);
