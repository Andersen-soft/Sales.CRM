// @flow

import React, { Component, type Node } from 'react';
import { isEmpty, pathOr } from 'ramda';
import classNames from 'classnames';
import { Filtration } from 'crm-components/common/CRMFiltrationComponent';
import Sorting from 'crm-components/common/CRMSortDirectionComponent/SortDirectionComponent';
import { withStyles } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableFooter,
    Grid,
} from '@material-ui/core';
import CRMPagination from 'crm-ui/CRMPagination/CRMPagination';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMTableRowMemo from './CRMTableRowMemo';

import styles from './CRMTableStyles';

type ColumnConfig = {
    title: string,
    key: string,
    visible?: boolean,
    RenderCell?: Node,
    filterParams?: {
        component: typeof Component,
        filterName?: string,
        onSetFilters: (fieldName: string, filterValue: number | string | Array<string> | Array<number>) => void,
        getFilterParams?: () => void,
        filters: Object,
        customIcon: typeof Component,
    },
    sortingParams?: {
        changeSorting: string => void,
        sort: string,
    },
}

type PaginationType = {
    rowsPerPage: number,
    count: number,
    onChangePage: (number) => any,
    page: number,
}

type Props = {
    data: Array<Object>,
    columnsConfig: Array<ColumnConfig>,
    paginationParams?: PaginationType,
    isLoading?: boolean,
    classes: Object,
    editableRowId?: number | null,
    updateEditRowState?: () => void,
    cellClasses: Object,
    loaderPosition?: 'string',
    checkedRowsIds?: Array<number>,
    highlightedRows?: Array<number> | null,
    showRowsCount?: boolean,
    noResultsFoundText?: string,
}

const CRMTable = ({
    data,
    columnsConfig,
    isLoading,
    classes,
    paginationParams,
    editableRowId,
    updateEditRowState,
    cellClasses,
    loaderPosition,
    checkedRowsIds = [],
    highlightedRows = null,
    showRowsCount = false,
    noResultsFoundText,
}: Props) => {
    const translations = {
        noResultsFound: useTranslation('common.noResultsFound'),
        rowsInTable: useTranslation('common.rowsInTable'),
    };

    const renderHeader = () => (
        <TableRow classes={{ head: classes.head }}>
            {columnsConfig.filter(({ visible = true }) => visible).map(({ key, title, filterParams, sortingParams }) => (
                <TableCell
                    key={key}
                    className={classNames(classes.headerCell, cellClasses && pathOr(null, [key], cellClasses))}
                >
                    <Grid
                        container
                        alignItems='center'
                    >
                        <Grid className={classes.title}>
                            {title}
                        </Grid>
                        {filterParams && <Grid>
                            <Filtration
                                filterName={key}
                                {...filterParams}
                            />
                        </Grid>}
                        {sortingParams && <Grid>
                            <Sorting
                                columnKey={key}
                                {...sortingParams}
                            />
                        </Grid>}
                    </Grid>
                </TableCell>
            ))}
        </TableRow>
    );

    const renderErrorMessage = () => (
        <TableRow>
            <TableCell
                colSpan={columnsConfig.length}
                className={classNames(classes.center, classes.error)}
            >
                {noResultsFoundText || translations.noResultsFound}
            </TableCell>
        </TableRow>
    );

    const renderPagination = () => {
        if (!paginationParams || paginationParams.rowsPerPage >= paginationParams.count) {
            return null;
        }

        const { rowsPerPage, count, onChangePage, page } = paginationParams;

        return (
            <TableRow>
                <TableCell
                    colSpan={columnsConfig.length}
                    className={classes.center}
                >
                    <CRMPagination
                        rowsPerPage={rowsPerPage}
                        count={count}
                        onChangePage={onChangePage}
                        page={page}
                    />
                </TableCell>
            </TableRow>
        );
    };

    const renderInfoRow = () => <TableRow className={classes.infoRow}>
        <TableCell
            colSpan={columnsConfig.length}
            className={classes.rowCount}
        >
            {`${translations.rowsInTable}: ${pathOr(0, ['count'], paginationParams)}`}
        </TableCell>
    </TableRow>;

    return (
        <Grid className={classes.root}>
            <Table
                className={classes.table}
                classes={{ root: classes.tableRoot }}
                size='small'
            >
                <TableHead>
                    {renderHeader()}
                </TableHead>
                <TableBody>
                    {data.map((row, index) => <CRMTableRowMemo
                        key={row.id}
                        classes={classes}
                        row={row}
                        index={index}
                        checkedRow={checkedRowsIds.includes(row.id)}
                        columnsConfig={columnsConfig}
                        cellClasses={cellClasses}
                        editableRowId={editableRowId}
                        updateEditRowState={updateEditRowState}
                        highlightedRows={highlightedRows}
                    />)}
                </TableBody>
                <TableFooter>
                    {showRowsCount && renderInfoRow()}
                    {isEmpty(data)
                        ? renderErrorMessage()
                        : renderPagination()
                    }
                </TableFooter>
            </Table>
            {isLoading && <CRMLoader position={loaderPosition}/>}
        </Grid>
    );
};

export default withStyles(styles)(CRMTable);
