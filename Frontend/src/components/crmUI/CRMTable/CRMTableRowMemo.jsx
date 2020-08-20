// @flow

import React, { useMemo } from 'react';
import {
    TableCell,
    TableRow,
} from '@material-ui/core';
import { pathOr } from 'ramda';
import classNames from 'classnames';
import isOdd from 'crm-utils/isOdd';

type Props = {
    classes: Object,
    row: Object,
    index: number,
    checkedRow: boolean,
    columnsConfig: Array<Object>,
    cellClasses: Object,
    editableRowId?: number | null,
    updateEditRowState?: () => void,
    highlightedRows: Array<number> | null,
}

const CRMTableRow = ({
    classes,
    row,
    index,
    checkedRow,
    columnsConfig,
    cellClasses,
    editableRowId,
    updateEditRowState,
    highlightedRows,
}: Props) => {
    const getClassName = () => {
        switch (true) {
            case (checkedRow):
                return classes.rowSelected;
            case (!highlightedRows && isOdd(index)):
                return classes.oddRow;
            case (Array.isArray(highlightedRows) && highlightedRows.includes(row.id)):
                return classes.oddRow;
            default:
                return '';
        }
    };

    return <TableRow
        className={getClassName()}
        classes={{ root: classes.row }}
    >
        {
            columnsConfig.filter(({ visible = true }) => visible)
                .map(({ key, RenderCell }) => (
                    <TableCell
                        key={key}
                        className={classNames(classes.cell, cellClasses && pathOr(null, [key], cellClasses))}
                    >
                        {RenderCell
                            ? <RenderCell
                                values={row[key]}
                                isEdit={row.id === editableRowId}
                                updateEditRowState={updateEditRowState}
                            />
                            : row[key]}
                    </TableCell>
                ))
        }
    </TableRow>;
};

const CRMTableRowMemo = ({
    classes,
    row,
    index,
    checkedRow,
    columnsConfig,
    cellClasses,
    editableRowId,
    updateEditRowState,
    highlightedRows,
}: Props) => {
    const useMemoWrapper = (Component, dependencies) => useMemo(() => Component, dependencies);

    return useMemoWrapper(<CRMTableRow
        classes={classes}
        row={row}
        index={index}
        checkedRow={checkedRow}
        columnsConfig={columnsConfig}
        cellClasses={cellClasses}
        editableRowId={editableRowId}
        updateEditRowState={updateEditRowState}
        highlightedRows={highlightedRows}
    />, [row, checkedRow, editableRowId, highlightedRows, columnsConfig]);
};

export default CRMTableRowMemo;
