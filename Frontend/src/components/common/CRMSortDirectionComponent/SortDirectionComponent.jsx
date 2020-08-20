// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { DIRECTION } from 'crm-constants/allResumeRequests/resumeRequestsConstants';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';

import styles from './SortDirectionComponentStyles';

type Props = {
    columnKey: string,
    sort: string,
    changeSorting: (string) => void,
    classes: Object
}

const SortDirectionComponent = ({
    columnKey,
    sort,
    changeSorting,
    classes,
}: Props) => {
    let [sortKey, sortDirection] = sort ? sort.split(',') : [columnKey, DIRECTION.DESC];

    if (columnKey !== sortKey) {
        sortDirection = DIRECTION.DESC;
    }

    const changeDirection = () => {
        sortDirection === DIRECTION.DESC
            ? changeSorting(`${columnKey},${DIRECTION.ASC}`)
            : changeSorting(`${columnKey},${DIRECTION.DESC}`);
    };

    return (
        sortDirection === DIRECTION.DESC
            ? <ArrowDropDown
                onClick={changeDirection}
                className={classes.titlesAction}
            />
            : <ArrowDropUp
                onClick={changeDirection}
                className={classes.titlesAction}
            />
    );
};

export default withStyles(styles)(SortDirectionComponent);
