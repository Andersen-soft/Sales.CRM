// @flow

import React, { useState } from 'react';
import {
    Grid,
    Typography,
    IconButton,
    Tooltip,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { saveAs } from 'file-saver';
import InsertChartOutlinedOutlinedIcon from '@material-ui/icons/InsertChartOutlinedOutlined';
import Download from '@material-ui/icons/GetApp';
import CRMDateRangeInput from 'crm-components/common/CRMDateRangeInput/CRMDateRangeInput';
import CRMIcon from 'crm-ui/CRMIcons';
import CRMInputSearch from 'crm-ui/CRMInput/CRMInput';
import { useTranslation } from 'crm-hooks/useTranslation';
import { getDate } from 'crm-utils/dates';
import { CRM_FULL_DATE_SERVER_FORMAT } from 'crm-constants/dateFormat';
import { fetchSocialContactsCSV } from 'crm-api/reportBySocialContactsSalesHead/reportBySocialContactsSalesHead';
import clearMultipleSpace from 'crm-utils/dataTransformers/clearMultipleSpace';
import { KEY_ENTER } from 'crm-constants/keyCodes';
import StatisticModal from './StatisticModal';
import { crmTrim } from 'crm-utils/trimValue';

import styles from './ReportBySocialContactsSalesHeadStyles';

const PageHeader = ({
    classes,
    setDownload,
    dateRange,
    search,
    filters,
    handleSelectRange,
    applySearch,
}) => {
    const [localSearch, setLocalSearch] = useState(search);
    const [showStatisticModal, setShowStatisticModal] = useState(false);

    const translations = {
        allSocialAnswer: useTranslation('allSocialNetworkAnswers.allSocialNetwork'),
        search: useTranslation('common.search'),
        downloadCSV: useTranslation('allSocialNetworkAnswers.downloadCSV'),
        statistic: useTranslation('allSocialNetworkAnswers.statistic'),
    };

    const handleDownloadReport = async () => {
        setDownload(true);
        const fileReport = await fetchSocialContactsCSV({
            createDate: [
                getDate(dateRange.startDate, CRM_FULL_DATE_SERVER_FORMAT),
                getDate(dateRange.endDate, CRM_FULL_DATE_SERVER_FORMAT),
            ],
            search: clearMultipleSpace(search),
            ...filters,
        });

        saveAs(new Blob([fileReport]), 'report_by_social_contacts.csv');
        setDownload(false);
    };

    const changeSearchValue = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        setLocalSearch(value);
    };

    const blurSearchValue = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        setLocalSearch(crmTrim(value));
        applySearch(localSearch);
    };

    const onKeyPress = ({ key }: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (key === KEY_ENTER.key) {
            setLocalSearch(crmTrim(localSearch));
            applySearch(crmTrim(localSearch));
        }
    };

    const clearSearchField = () => {
        applySearch('');
        setLocalSearch('');
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
                    {translations.allSocialAnswer}
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
                        onSelectRange={handleSelectRange}
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
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
                        onBlur={blurSearchValue}
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
                        title={translations.statistic}
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
                <Grid
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
