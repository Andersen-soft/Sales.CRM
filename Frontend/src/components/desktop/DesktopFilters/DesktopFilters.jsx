// @flow

import React, { useState, useEffect } from 'react';
import { Grid, Drawer } from '@material-ui/core';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles/index';
import CRMIcon from 'crm-icons';
import CRMInputSearch from 'crm-ui/CRMInput/CRMInput';
import CRMDateRangeInput from 'crm-components/common/CRMDateRangeInput/CRMDateRangeInput';
import DesktopStatusFilters from 'crm-components/desktop/DesktopStatusFilters';
import RightDubleArrowIcon from 'crm-static/customIcons/right_duble_arrow.svg';
import LeftDubleArrowIcon from 'crm-static/customIcons/left_duble_arrow.svg';
import getObjectWithoutEmptyProperties from 'crm-utils/dataTransformers/getObjectWithoutEmptyProperties';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from 'crm-components/desktop/DesktopFilters/DesktopFiltersStyles';

type Props = {
    classes: Object,
    nextActivityDateFilter: Array<string>,
    onApplySearchValue: (event: SyntheticInputEvent<HTMLInputElement>) => void,
    onBlurSearch: (event: SyntheticInputEvent<HTMLInputElement>) => void,
    clearSearchField: () => void,
    searchValue: string,
    changeNextActivityDateFilter: (startDate: Date, endDate: Date) => void,
    changeStatusFilter: (filter: string) => void,
    statusFilter: Array<string>,
    salesCount: { [string]: number },
    pastActivitiesCount: number,
}

const DesktopFilters = ({
    classes,
    nextActivityDateFilter,
    onApplySearchValue,
    onBlurSearch,
    clearSearchField,
    searchValue,
    changeNextActivityDateFilter,
    changeStatusFilter,
    statusFilter,
    salesCount,
    pastActivitiesCount,
}: Props) => {
    const [openFilters, setOpenFilters] = useState(true);
    const [rangeKey, setRangeKey] = useState(Date.now());
    const [localSearchValue, setLocalSearchValue] = useState(searchValue);

    const translations = {
        search: useTranslation('common.search'),
    };

    useEffect(() => {
        searchValue !== localSearchValue && setLocalSearchValue(searchValue);
    }, [searchValue]);

    const handleToogleDrawer = () => setOpenFilters(!openFilters);

    const onKeyPress = event => {
        const { key, target: { value } } = event;

        if (key === 'Enter') {
            setRangeKey(Date.now());
            onApplySearchValue(value);
        }
    };

    const resetLocalSearch = () => {
        setLocalSearchValue('');
        clearSearchField();
    };

    const renderOpenFilers = () => {
        const [startDate, endDate] = nextActivityDateFilter;
        const initialDateRange = {
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
        };
        const initialDateForDateRangeInput = getObjectWithoutEmptyProperties(initialDateRange);
        const isShowClearIcon = !!Object.keys(initialDateForDateRangeInput).length;

        return (
            <>
                <Grid
                    container
                    direction='column'
                    className={classes.filterWrapper}
                    wrap='nowrap'
                >
                    <CRMInputSearch
                        searchable
                        fullWidth
                        placeholder={translations.search}
                        className={classes.search}
                        onChange={({ target: { value } }) => setLocalSearchValue(value)}
                        onKeyPress={onKeyPress}
                        onBlur={onBlurSearch}
                        onClear={resetLocalSearch}
                        value={localSearchValue}
                    />
                    <CRMDateRangeInput
                        {... initialDateForDateRangeInput}
                        fullWidth
                        key={rangeKey}
                        onSelectRange={changeNextActivityDateFilter}
                        clearable={isShowClearIcon}
                        controlled
                        inputClasses={{ input: classes.dateRangeInput }}
                    />
                    <DesktopStatusFilters
                        setFilter={changeStatusFilter}
                        statusFilter={statusFilter}
                        salesCount={salesCount}
                        pastActivitiesCount={pastActivitiesCount}
                    />
                </Grid>
                <Grid className={classes.openIcon}>
                    <CRMIcon
                        IconComponent={LeftDubleArrowIcon}
                        onClick={handleToogleDrawer}
                    />
                </Grid>
            </>
        );
    };

    const renderCloseFilters = () => (
        <Grid
            container
            className={classes.closeIcon}
            direction='column'
            justify='flex-end'
            onClick={handleToogleDrawer}
        >
            <CRMIcon IconComponent={RightDubleArrowIcon} />
        </Grid>
    );

    return (
        <Drawer
            variant='permanent'
            className={classnames(classes.drawer, {
                [classes.drawerOpen]: openFilters,
                [classes.drawerClose]: !openFilters,
            })}
            classes={{
                paper: classnames(classes.drawerPaper, {
                    [classes.drawerOpen]: openFilters,
                    [classes.drawerClose]: !openFilters,
                }),
            }}
            open={openFilters}
        >
            {openFilters
                ? renderOpenFilers()
                : renderCloseFilters()
            }
        </Drawer>
    );
};

export default withStyles(styles)(DesktopFilters);
