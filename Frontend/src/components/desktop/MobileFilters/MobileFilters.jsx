// @flow

import React, { useState, useEffect, useRef } from 'react';
import { Grid, IconButton, Typography, Button, RootRef } from '@material-ui/core';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles/index';
import CRMIcon from 'crm-icons';
import CRMInputSearch from 'crm-ui/CRMInput/CRMInput';
import CRMDateRangeInput from 'crm-components/common/CRMDateRangeInput/CRMDateRangeInput';
import Filters from 'crm-static/customIcons/filters.svg';
import ActiveFilters from 'crm-static/customIcons/acive_filters.svg';
import getObjectWithoutEmptyProperties from 'crm-utils/dataTransformers/getObjectWithoutEmptyProperties';
import { ALL_STATUSES, STATUSES } from 'crm-constants/desktop/statuses';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CRMDrawer from 'crm-ui/CRMDrawer/CRMDrawer';
import { getDate } from 'crm-utils/dates';
import { CRM_FULL_DATE_SERVER_FORMAT } from 'crm-constants/dateFormat';
import { FormattedMessage } from 'react-intl';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from 'crm-components/desktop/MobileFilters/MobileFiltersStyles';

type Props = {
    classes: Object,
    nextActivityDateFilter: Array<string | null>,
    onApplySearchValue: (event: SyntheticInputEvent<HTMLInputElement>) => void,
    onBlurSearch: (event: SyntheticInputEvent<HTMLInputElement>) => void,
    clearSearchField: () => void,
    searchValue: string,
    statusFilter: Array<string>,
    onApplyFilterValues: (statuses?: Array<string>, date?: Array<string | null>) => void,
    onResetFilterValues: () => void,
}

const MobileFilters = ({
    classes,
    onApplySearchValue,
    clearSearchField,
    searchValue: incomingSearchValue,
    onApplyFilterValues,
    onBlurSearch,
    onResetFilterValues,
    nextActivityDateFilter: incomingNextActivityDateFilter,
    statusFilter: incomingStatusFilter,
}: Props) => {
    const [openFilters, setOpenFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState(incomingStatusFilter);
    const [nextActivityDateFilter, setNextActivityDateFilter] = useState(incomingNextActivityDateFilter);
    const [rangeKey, setRangeKey] = useState(Date.now());
    const [searchValue, setSearchValue] = useState(incomingSearchValue);

    const inputRef: {current: Object} = useRef(null);
    const container: {current: Object} = useRef(null);

    const translations = {
        filter: useTranslation('common.filter'),
        status: useTranslation('common.status'),
        reset: useTranslation('common.reset'),
        apply: useTranslation('common.apply'),
        search: useTranslation('common.search'),
    };

    useEffect(() => {
        incomingSearchValue !== searchValue && setSearchValue(incomingSearchValue);
    }, [incomingSearchValue]);

    useEffect(() => {
        setStatusFilter(incomingStatusFilter);
        setNextActivityDateFilter(incomingNextActivityDateFilter);
    }, [openFilters]);

    const [startDate, endDate] = nextActivityDateFilter;
    const initialDateRange = {
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
    };
    const initialDateForDateRangeInput = getObjectWithoutEmptyProperties(initialDateRange);
    const isShowClearIcon = !!Object.keys(initialDateForDateRangeInput).length;

    const handleToogleDrawer = () => setOpenFilters(!openFilters);

    const onKeyPress = event => {
        const { key, target: { value } } = event;

        if (key === 'Enter') {
            setRangeKey(Date.now());
            onApplySearchValue(value);

            inputRef.current.blur();
            container.current.click();
        }
    };

    const resetLocalSearch = () => {
        setSearchValue('');
        clearSearchField();
    };

    const getFilterButtonsClass = (title: string, styleClass: string) => {
        if (statusFilter.includes(title)) {
            return classnames(classes.filterButton, classes[styleClass], classes[`${styleClass}Active`]);
        }

        return classnames(classes.filterButton, classes[styleClass]);
    };

    const resetFilters = () => {
        setRangeKey(Date.now());
        setStatusFilter([ALL_STATUSES]);
        setNextActivityDateFilter([getDate(new Date(), CRM_FULL_DATE_SERVER_FORMAT)]);
    };

    const applyFilters = () => {
        setOpenFilters(false);
        onApplyFilterValues(statusFilter, nextActivityDateFilter);
    };

    const changeStatusFilter = (filter: string) =>
        !statusFilter.includes(filter) && setStatusFilter([filter]);

    const changeNextActivityDateFilter = (start, end) => {
        const activityStartDate = start ? getDate(start, CRM_FULL_DATE_SERVER_FORMAT) : null;
        const activityEndDate = end ? getDate(end, CRM_FULL_DATE_SERVER_FORMAT) : null;
        const dateFilter = [];

        activityStartDate && dateFilter.push(activityStartDate);
        activityEndDate && dateFilter.push(activityEndDate);

        setNextActivityDateFilter(dateFilter);
    };

    const renderFiltrPanel = () => (
        <CRMDrawer
            onToogleDrawer={handleToogleDrawer}
            open={openFilters}
        >
            <Grid
                container
                direction='column'
                jusify='flex-start'
            >
                <Grid
                    container
                    direction='row'
                    justify='space-between'
                    alignItems='center'
                >
                    <Typography variant='body1'>
                        {translations.filter}
                    </Typography>
                    <IconButton onClick={handleToogleDrawer}>
                        <CRMIcon IconComponent={ActiveFilters} />
                    </IconButton>
                </Grid>
                <Grid
                    container
                    direction='row'
                    justify='flex-start'
                    alignItems='center'
                    className={classes.filterRow}
                >
                    <CRMDateRangeInput
                        {... initialDateForDateRangeInput}
                        fullWidth
                        key={rangeKey}
                        onSelectRange={(start, end) => { changeNextActivityDateFilter(start, end); }}
                        clearable={isShowClearIcon}
                    />
                </Grid>
                <Grid
                    container
                    direction='row'
                    justify='flex-start'
                    alignItems='center'
                    className={classes.filterRow}
                >
                    <Typography variant='body1'>
                        {translations.status}
                    </Typography>
                </Grid>
                <Grid
                    container
                    direction='row'
                    justify='space-between'
                    alignItems='center'
                    className={classes.filterRow}
                    spacing={2}
                >
                    {STATUSES.map(({ statusKey, styleClass, translateKey }) => (
                        <Grid
                            key={statusKey}
                            item
                            xs={6}
                        >
                            <Button
                                onClick={() => changeStatusFilter(statusKey)}
                                className={getFilterButtonsClass(statusKey, styleClass)}
                                disableRipple
                            >
                                <FormattedMessage id={translateKey} />
                            </Button>
                        </Grid>
                    ))}
                </Grid>
                <Grid
                    container
                    direction='row'
                    justify='space-around'
                    alignItems='center'
                    className={classnames(classes.filterRow, classes.actions)}
                    spacing={2}
                >
                    <Grid
                        item
                        xs={5} sm={5}
                        lg={5} xl={5}
                    >
                        <CRMButton
                            fullWidth
                            onClick={resetFilters}
                        >
                            {translations.reset}
                        </CRMButton>
                    </Grid>
                    <Grid
                        item
                        xs={5} sm={5}
                        lg={5} xl={5}
                    >
                        <CRMButton
                            fullWidth
                            variant='action'
                            onClick={applyFilters}
                        >
                            {translations.apply}
                        </CRMButton>
                    </Grid>
                </Grid>
            </Grid>
        </CRMDrawer>
    );

    return (
        <RootRef rootRef={container}>
            <Grid className={classes.mobileFilters}>
                <Grid
                    container
                    alignItems='center'
                    wrap='nowrap'
                >
                    <CRMInputSearch
                        searchable
                        fullWidth
                        placeholder={translations.search}
                        onChange={({ target: { value } }) => setSearchValue(value)}
                        onKeyPress={onKeyPress}
                        onClear={resetLocalSearch}
                        onBlur={onBlurSearch}
                        value={searchValue}
                        inputRef={inputRef}
                    />
                    <IconButton onClick={handleToogleDrawer}>
                        <CRMIcon IconComponent={Filters} />
                    </IconButton>
                </Grid>
                {renderFiltrPanel()}
            </Grid>
        </RootRef>
    );
};

export default withStyles(styles)(MobileFilters);
