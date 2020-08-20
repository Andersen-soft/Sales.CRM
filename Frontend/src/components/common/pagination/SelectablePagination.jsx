// @flow

import React, { PureComponent } from 'react';

import { TablePagination } from '@material-ui/core';

import PaginationActions from './PaginationActions';

type Props = {
    classes: Object,
    count: number,
    component: string,
    rowsPerPage: number,
    page: number,
    rowsPerPageOptions: Array<number>,
    colSpan: number,
    onChangePage: (event: SyntheticEvent<*>) => void,
}

class SelectablePagination extends PureComponent<Props> {
    render() {
        const {
            count = 0,
            rowsPerPage,
            page,
            rowsPerPageOptions = [],
            onChangePage: handleChangePage,
            classes,
            component = 'div',
            colSpan,
        } = this.props;

        return (
            <TablePagination
                rowsPerPageOptions={[...rowsPerPageOptions]}
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                ActionsComponent={PaginationActions}
                component={component}
                labelDisplayedRows={() => ''}
                classes={classes}
                colSpan={colSpan}
            />
        );
    }
}

export default SelectablePagination;
