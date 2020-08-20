// @flow

import React, { Component, useState, useRef } from 'react';
import { isEmpty, isNil } from 'ramda';
import { RootRef, Grid, Fade, Popover } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import FilterList from '@material-ui/icons/FilterList';
import Close from '@material-ui/icons/Close';
import CRMIcon from 'crm-ui/CRMIcons';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './FiltrationComponentStyles';

type Props = {
    component: typeof Component,
    filterName: string,
    onSetFilters: (filterName: string, filterValue: number | string, Array<string> | Array<number> | null) => void,
    getFilterParams?: Function,
    filters: Object,
    customIcon: typeof Component,
    customProps: Object,
} & StyledComponentProps;

const Filtration = ({
    classes,
    filterName,
    onSetFilters,
    component: FilterComponent,
    getFilterParams,
    filters,
    customIcon: CustomIcon,
    customProps,
}: Props) => {
    const [anchor, setAnchor] = useState(null);

    const filterRef: {current: Object} = useRef(null);

    const isFiltered = () => !(isEmpty(filters[filterName]) || isNil(filters[filterName]));

    const handleOpenFiltration = ({ currentTarget }: SyntheticEvent<EventTarget>) => {
        setAnchor(currentTarget);
    };

    const handleClearFilters = () => onSetFilters(filterName, null);

    const handleDestroyFiltration = () => setAnchor(null);

    const isOpen = Boolean(anchor);

    return (
        <RootRef rootRef={filterRef}>
            <Grid className={classes.wrapper}>
                <Grid className={classes.iconsWrapper}>
                    <CRMIcon
                        IconComponent={CustomIcon || FilterList}
                        className={classes.icon}
                        onClick={handleOpenFiltration}
                    />
                    {isFiltered() && <CRMIcon
                        IconComponent={Close}
                        className={classes.icon}
                        onClick={handleClearFilters}
                    />}
                </Grid>
                <Popover
                    open={isOpen}
                    TransitionComponent={Fade}
                    classes={{ paper: classes.input }}
                    className={classes.paper}
                    anchorEl={anchor}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    onClose={handleDestroyFiltration}
                >
                    <FilterComponent
                        filters={filters}
                        filterName={filterName}
                        onSetFilters={onSetFilters}
                        getFilterParams={getFilterParams}
                        onClose={handleDestroyFiltration}
                        customProps={customProps}
                    />
                </Popover>
            </Grid>
        </RootRef>
    );
};

export default withStyles(styles)(Filtration);

