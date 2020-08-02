// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Pagination from 'material-ui-flat-pagination';

import styles from './CRMPaginationStyles';

type paginationType = {
    count: number,
    page?: number,
    rowsPerPage: number,
    onChangePage: (number) => any,
    classes: Object,
}

const CRMPagination = ({
    count,
    page = 0,
    rowsPerPage,
    onChangePage,
    classes,
}: paginationType) => {
    const [offset, setOffset] = React.useState(page * rowsPerPage);

    if (offset !== (page * rowsPerPage)) {
        setOffset(page * rowsPerPage);
    }

    const handleClick = (e, newOffset, newPage) => {
        setOffset(newOffset);
        onChangePage(newPage - 1);
    };

    return (
        <Pagination
            limit={rowsPerPage}
            offset={offset}
            total={count}
            onClick={handleClick}
            reduced
            disableRipple
            classes={{
                textPrimary: classes.textPrimary,
                textSecondary: classes.textSecondary,
                text: classes.text,
                rootCurrent: classes.current,
            }}
        />
    );
};

export default withStyles(styles)(CRMPagination);
