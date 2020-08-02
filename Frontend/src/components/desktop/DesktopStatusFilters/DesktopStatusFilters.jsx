// @flow

import React from 'react';
import { Button, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
    STATUSES,
    ARCHIVE,
    OVERDUE_ACTIVITIES,
    ALL_STATUSES,
} from 'crm-constants/desktop/statuses';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import styles from './DesktopStatusFiltersStyles';

type Props = {
    setFilter: (filter: string) => void,
    statusFilter: string,
    salesCount: { [string]: number },
    pastActivitiesCount: number,
    classes: Object,
};

const DesktopStatusFilters = ({
    classes,
    statusFilter,
    salesCount,
    setFilter,
    pastActivitiesCount,
}: Props) => {
    const getFilterButtonsClass = (statusKey: string, styleClass: string) => {
        if (statusFilter.includes(statusKey)) {
            return classNames(classes.filterButton, classes[styleClass], classes.active);
        }

        return classNames(classes.filterButton, classes[styleClass]);
    };

    const getSalesCountByStatus = (statusKey: string) => {
        const statusCount = salesCount[statusKey];

        if (statusKey === ALL_STATUSES) {
            return Object.keys(salesCount)
                .reduce((result, key) => (key === ARCHIVE ? result : result + Number(salesCount[key])), 0);
        }

        if (!statusCount) {
            return 0;
        }

        return statusCount;
    };

    return (
        <Grid
            container
            direction='column'
            className={classes.container}
        >
            {STATUSES.map(({ statusKey, styleClass, translateKey }) => (
                <Button
                    key={statusKey}
                    onClick={() => setFilter(statusKey)}
                    className={getFilterButtonsClass(statusKey, styleClass)}
                    disableRipple
                >
                    <Grid
                        container
                        justify='space-between'
                        alignItems='center'
                        className={classes.statusTitle}
                    >
                        <Grid>
                            <FormattedMessage id={translateKey} />
                        </Grid>
                        { (statusKey !== ARCHIVE && statusKey !== OVERDUE_ACTIVITIES) && (
                            <Grid>
                                {getSalesCountByStatus(statusKey)}
                            </Grid>)
                        }
                        { (statusKey === OVERDUE_ACTIVITIES) && (
                            <Grid className={classes.overdueCounter}>
                                {pastActivitiesCount}
                            </Grid>)
                        }
                    </Grid>
                </Button>
            ))}
        </Grid>
    );
};

export default withStyles(styles)(DesktopStatusFilters);
