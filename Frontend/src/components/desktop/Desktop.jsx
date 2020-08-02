// @flow

import React, {
    useEffect, useState, useRef, useCallback,
} from 'react';
import classnames from 'classnames';
import { pathOr } from 'ramda';
import debounce from 'lodash.debounce';
import { isAfter, endOfDay } from 'date-fns';
import { Grid, RootRef } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import DesctopCards from 'crm-components/desktop/DesktopCards';
import { ALL_STATUSES } from 'crm-constants/desktop/statuses';
import { DESKTOP_PARAMS_KEY } from 'crm-constants/desktop/salesConstants';
import { CRM_FULL_DATE_SERVER_FORMAT } from 'crm-constants/dateFormat';
import CRMScrollTopButton from 'crm-ui/CRMScrollTopButton/CRMScrollTopButton';
import { getDate } from 'crm-utils/dates';
import Notification from 'crm-components/notification/NotificationSingleton';
import { getPastActivitiesCount } from 'crm-api/desktopService/salesService';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';
import DesctopFilters from './DesktopFilters/DesktopFilters';
import MobileFilters from './MobileFilters/MobileFilters';
import { useTranslation } from 'crm-hooks/useTranslation';
import { CANCELED_REQUEST } from 'crm-constants/common/constants';
import { crmTrim } from 'crm-utils/trimValue';

import type { StyledComponentProps } from '@material-ui/core/es';
import type { Sale } from 'crm-types/resourceDataTypes';
import type { fetchSalesArguments } from 'crm-api/desktopService/salesService';
import type { addActivityArguments } from 'crm-api/desktopService/activityService';
import type { UpdateSalePayload } from 'crm-api/saleService';

import styles from './DesktopStyles';

type Props = {
    salesCount: { [string]: number },
    fetchSalesCount: () => void,
    fetchSales: (params: fetchSalesArguments, canceled?: boolean) => void,
    editSale: (id: number, editSaleBody: UpdateSalePayload, salesRequestParams: fetchSalesArguments) => void,
    addActivity: (data: addActivityArguments, params: fetchSalesArguments) => void,
    userId: number,
    sales: {
        content: Array<Sale>,
        totalElements: number,
    },
    isLoading: boolean,
} & StyledComponentProps

const filtersParams = {};

const Desktop = ({
    classes,
    salesCount,
    fetchSalesCount,
    fetchSales,
    editSale,
    addActivity,
    userId,
    sales,
    isLoading,
}: Props) => {
    const desctopCardsWrapper: {current: Object} = useRef(null);
    const [statusFilter, setStatusFilter] = useState([ALL_STATUSES]);
    const [nextActivityDateFilter, setNextActivityDateFilter] = useState(
        [getDate(new Date(), CRM_FULL_DATE_SERVER_FORMAT), getDate(new Date(), CRM_FULL_DATE_SERVER_FORMAT)]);
    const [searchValue, setSearchValue] = useState('');
    const [page, setPage] = useState(0);
    const [pastActivitiesCount, setPastActivitiesCount] = useState(0);

    const translations = {
        title: useTranslation('header.desktop'),
        notificationNextActivityNotPast: useTranslation('sale.saleSection.notificationNextActivityNotPast'),
    };

    const isMobile = useMobile();

    const updatePastActivitiesCount = async () => {
        const activitiesCount = await getPastActivitiesCount();

        setPastActivitiesCount(activitiesCount);
    };

    useEffect(() => {
        document.title = translations.title;
        const desktopParams = localStorage.getItem(DESKTOP_PARAMS_KEY);
        let fetchParams = {
            page,
            userId,
        };

        if (desktopParams) {
            const localStorageParams = JSON.parse(desktopParams);

            setStatusFilter(pathOr([ALL_STATUSES], ['statusFilter'], localStorageParams));
            setNextActivityDateFilter(pathOr([], ['nextActivityDateFilter'], localStorageParams));
            setSearchValue(pathOr('', ['searchValue'], localStorageParams));

            const partialParams = localStorageParams.searchValue
                ? { search: localStorageParams.searchValue }
                : { activityDate: localStorageParams.nextActivityDateFilter,
                    statusFilter: localStorageParams.statusFilter };

            fetchParams = { ...fetchParams, ...partialParams };
        } else {
            fetchParams = { ...fetchParams, statusFilter, activityDate: nextActivityDateFilter };
        }

        fetchSales(fetchParams, CANCELED_REQUEST);

        fetchSalesCount();
        updatePastActivitiesCount();

        return () => localStorage.setItem(DESKTOP_PARAMS_KEY, JSON.stringify(filtersParams));
    }, []);

    useEffect(() => {
        filtersParams.statusFilter = statusFilter;
        filtersParams.nextActivityDateFilter = nextActivityDateFilter;
        filtersParams.searchValue = searchValue;
    }, [statusFilter, nextActivityDateFilter, searchValue]);

    const resetSearchState = () => {
        setSearchValue('');
        setPage(0);
    };

    const searchSales = useCallback(debounce((params: fetchSalesArguments) => fetchSales(params, CANCELED_REQUEST), 300), []);

    const scrollTop = () => {
        desctopCardsWrapper.current.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };

    const onChangePage = async newPage => {
        setPage(newPage);

        await fetchSales({
            statusFilter,
            activityDate: nextActivityDateFilter,
            page: newPage,
            userId,
        }, CANCELED_REQUEST);
        scrollTop();
    };

    const onSaveNextActivityComment = async (
        id: number,
        { target: { value } }: SyntheticInputEvent<HTMLInputElement>,
    ) => {
        await editSale(
            id,
            { description: crmTrim(value) },
            {
                isFirstRequest: false,
                statusFilter,
                activityDate: nextActivityDateFilter,
                search: searchValue,
                userId,
                page,
            }
        );
    };

    const handleNextActivityDateChange = async (id, date) => {
        const currentDate = new Date();

        if (isAfter(currentDate, endOfDay(date))) {
            Notification.showMessage({ message: translations.notificationNextActivityNotPast });
        } else {
            await editSale(
                id,
                { nextActivityDate: getDate(endOfDay(date), CRM_FULL_DATE_SERVER_FORMAT) },
                {
                    isFirstRequest: true,
                    statusFilter,
                    activityDate: nextActivityDateFilter,
                    search: searchValue,
                    userId,
                    page,
                }
            );

            updatePastActivitiesCount();
        }
    };

    const changeStatusFilter = (filter: string) => {
        if (!statusFilter.includes(filter)) {
            setStatusFilter([filter]);
            resetSearchState();

            searchSales({
                statusFilter: [filter],
                activityDate: nextActivityDateFilter,
                page: 0,
                userId,
            });
            scrollTop();
        }
    };

    const changeNextActivityDateFilter = (startDate, endDate) => {
        const activityStartDate = startDate ? getDate(startDate, CRM_FULL_DATE_SERVER_FORMAT) : null;
        const activityEndDate = endDate ? getDate(endOfDay(endDate), CRM_FULL_DATE_SERVER_FORMAT) : null;
        const dateFilter = [];

        activityStartDate && dateFilter.push(activityStartDate);
        if (activityStartDate !== activityEndDate) {
            activityEndDate && dateFilter.push(activityEndDate);
        }

        setNextActivityDateFilter(dateFilter);
        resetSearchState();

        searchSales({
            statusFilter,
            activityDate: dateFilter,
            page: 0,
            userId,
        });
        scrollTop();
    };

    const clearSearchField = () => {
        resetSearchState();

        searchSales({
            statusFilter,
            activityDate: nextActivityDateFilter,
            page: 0,
            userId,
        });
        scrollTop();
    };

    const resetFilterValues = () => {
        setStatusFilter([ALL_STATUSES]);
        setNextActivityDateFilter([null]);

        searchSales({
            statusFilter: [ALL_STATUSES],
            activityDate: [null],
            page: 0,
            userId,
        });
        scrollTop();
    };

    const onApplySearchValue = search => {
        resetFilterValues();
        setPage(0);
        setSearchValue(crmTrim(search));

        searchSales({
            search: crmTrim(search),
            page: 0,
            userId,
        });
        scrollTop();
    };

    const onBlurSearch = ({ target: { value } }) => setSearchValue(crmTrim(value));

    const onApplyFilterValues = (statuses, date) => {
        resetSearchState();
        setStatusFilter(statuses);
        setNextActivityDateFilter(date);

        searchSales({
            statusFilter: statuses,
            activityDate: date,
            page: 0,
            userId,
        });
        scrollTop();
    };

    return (
        <Grid className={classnames(classes.desktop, { [classes.mobileDesctop]: isMobile })}>
            <Grid
                container
                direction={isMobile ? 'column' : 'row'}
                className={classes.wrapper}
                wrap='nowrap'
            >
                {isMobile
                    ? <MobileFilters
                        onApplySearchValue={onApplySearchValue}
                        onBlurSearch={onBlurSearch}
                        clearSearchField={clearSearchField}
                        searchValue={searchValue}
                        nextActivityDateFilter={nextActivityDateFilter}
                        statusFilter={statusFilter}
                        onApplyFilterValues={onApplyFilterValues}
                        onResetFilterValues={resetFilterValues}
                    />
                    : <DesctopFilters
                        onApplySearchValue={onApplySearchValue}
                        onBlurSearch={onBlurSearch}
                        clearSearchField={clearSearchField}
                        searchValue={searchValue}
                        nextActivityDateFilter={nextActivityDateFilter}
                        changeNextActivityDateFilter={changeNextActivityDateFilter}
                        statusFilter={statusFilter}
                        changeStatusFilter={changeStatusFilter}
                        salesCount={salesCount}
                        pastActivitiesCount={pastActivitiesCount}
                    />}
                <RootRef rootRef={desctopCardsWrapper}>
                    <Grid
                        container
                        className={isMobile ? classes.mobileCards : classes.cards}
                    >
                        <DesctopCards
                            sales={sales}
                            onChangePage={onChangePage}
                            page={page}
                            isLoading={isLoading}
                            onSaveNextActivityComment={onSaveNextActivityComment}
                            handleNextActivityDateChange={handleNextActivityDateChange}
                            userId={userId}
                            statusFilter={statusFilter}
                            searchValue={searchValue}
                            nextActivityDateFilter={nextActivityDateFilter}
                            editSale={editSale}
                            addActivity={addActivity}
                            updatePastActivitiesCount={updatePastActivitiesCount}
                        />
                        {!isMobile && <CRMScrollTopButton onClick={scrollTop} />}
                    </Grid>
                </RootRef>
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(Desktop);
