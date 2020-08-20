// @flow

import React, { useState, useEffect } from 'react';
import {
    IconButton,
    Dialog,
    DialogTitle,
    Grid,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import CRMIcon from 'crm-icons';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMDateRangeInput from 'crm-components/common/CRMDateRangeInput/CRMDateRangeInput';
import { getSocialContactStatistic } from 'crm-api/reportBySocialContactsSalesHead/reportBySocialContactsSalesHead';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import { FULL_DATE_DS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import StatusCell from './Cells/StatusCell';

import styles from './ReportBySocialContactsSalesHeadStyles';

type Props = {
    open: boolean,
    toggleShow: () => void,
    classes: Object,
    dateRange: {
        startDate: Date,
        endDate: Date,
    }
};

const StatisticModal = ({
    classes,
    open,
    toggleShow,
    dateRange,
}: Props) => {
    const [localDateRange, setLocalDateRange] = useState({ ...dateRange });
    const [statistic, setStatistic] = useState([]);
    const [loading, setLoading] = useState(false);

    const translations = {
        statistic: useTranslation('allSocialNetworkAnswers.statistic'),
        range: useTranslation('allSocialNetworkAnswers.range'),
        status: useTranslation('allSocialNetworkAnswers.status'),
        numberOfReplies: useTranslation('allSocialNetworkAnswers.numberOfReplies'),
    };

    const fetchStatistics = dateRangeProps => {
        setLoading(true);
        getSocialContactStatistic({
            createdFrom: getDate(dateRangeProps.startDate, FULL_DATE_DS),
            createdTo: getDate(dateRangeProps.endDate, FULL_DATE_DS),
        })
            .then(result => {
                setStatistic([{
                    status: 'APPLY',
                    value: result.APPLY,
                },
                {
                    status: 'REJECT',
                    value: result.REJECT,
                },
                {
                    status: 'AWAIT',
                    value: result.AWAIT,
                }]);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (open) {
            setLocalDateRange({ ...dateRange });
            fetchStatistics(dateRange);
        }
    }, [open]);

    const handleSelectRange = (startDate, endDate) => {
        if (startDate && endDate) {
            setLocalDateRange({ startDate, endDate });
            fetchStatistics({ startDate, endDate });
        }
    };

    const config = [
        {
            title: translations.status,
            key: 'status',
            RenderCell: StatusCell,
        },
        {
            title: translations.numberOfReplies,
            key: 'value',
        },
    ];

    const prepareData = rawData => rawData.map(({ status, value }) => ({
        id: status,
        status,
        value,
    }));

    return <Dialog
        open={open}
        onClose={toggleShow}
        PaperProps={{
            classes: {
                root: classes.modalRoot,
            },
        }}
    >
        <DialogTitle
            className={classes.modalTitle}
            disableTypography
        >
            {translations.statistic}
            <IconButton
                className={classes.closeButton}
                onClick={toggleShow}
            >
                <CRMIcon IconComponent={CloseIcon} />
            </IconButton>
        </DialogTitle>
        <Grid
            container
            alignItems='center'
            justify='flex-start'
            className={classes.range}
        >
            <Grid
                item
                className={classes.rangeTitle}
            >
                {`${translations.range}:`}
            </Grid>
            <Grid item>
                <CRMDateRangeInput
                    onSelectRange={handleSelectRange}
                    startDate={localDateRange.startDate}
                    endDate={localDateRange.endDate}
                    clearable={false}
                />
            </Grid>
        </Grid>
        <CRMTable
            data={prepareData(statistic)}
            columnsConfig={config}
            isLoading={loading}
            classes={{
                cell: classes.tableCell,
            }}
            cellClasses={{
                status: classes.statusCell,
                value: classes.valueCell,
            }}
        />
    </Dialog>;
};

export default withStyles(styles)(StatisticModal);
