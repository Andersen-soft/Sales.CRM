// @flow

import React, { useEffect, useState } from 'react';
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
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import { getStatistics } from 'crm-api/reportsByLeadService/reportService';
import { getDate } from 'crm-utils/dates';
import { FULL_DATE_DS } from 'crm-constants/dateFormat';
import { MAX_VISIBLE_IDS } from 'crm-constants/reportsByLead/reportsConstants';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import cn from 'classnames';
import { pages } from 'crm-constants/navigation';
import LinksBlock from 'crm-components/desktop/LinksBlock/LinksBlock';

import styles from './ReportByLeadPageStyles';

type Props = {
    open: boolean,
    toggleShow: () => void,
    classes: Object,
    dateRange: { from: Date, to: Date },
};

const StatisticModal = ({
    open,
    toggleShow,
    classes,
    dateRange,
}: Props) => {
    const translations = {
        sources: useTranslation('reportByLeadPage.sources'),
        numberOfLeads: useTranslation('reportByLeadPage.numberOfLeads'),
        sourceStatisticsPerPeriod: useTranslation('reportByLeadPage.sourceStatisticsPerPeriod'),
        total: useTranslation('reportByLeadPage.total'),
        modalFooterNoSales: useTranslation('reportByLeadPage.modalFooterNoSales'),
        modalFooterNoSalesBecause: useTranslation('reportByLeadPage.modalFooterNoSalesBecause'),
        hide: useTranslation('globalSearch.hide'),
        showMore: useTranslation('globalSearch.showMore'),
    };

    const [statistics, setStatistics] = useState({});
    const [modalLoading, setModalLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [showMissedSales, setShowMissedSales] = useState(false);
    const [withoutMainContact, setWithoutMainContact] = useState([]);

    useEffect(() => {
        if (open) {
            (async () => {
                setModalLoading(true);
                const { statistics: dataStatistic, withoutMainContact: withoutMainContactData } = await getStatistics({
                    from: getDate(dateRange.from, FULL_DATE_DS),
                    to: getDate(dateRange.to, FULL_DATE_DS),
                });
                const dataTotal = Object.values(dataStatistic)
                    .reduce((acc, quantity) => acc + Number(quantity), 0);

                setWithoutMainContact(withoutMainContactData);
                setStatistics(dataStatistic);
                setTotal(dataTotal);
                setModalLoading(false);
            })();
        }
    }, [open]);

    const config = [
        {
            title: translations.sources,
            key: 'source',
        },
        {
            title: translations.numberOfLeads,
            key: 'quantity',
        },
    ];

    const prepareData = rawData => {
        const rawDataArray = Object.entries(rawData);

        // throw empty array
        if (rawDataArray.length === 0) {
            return rawDataArray;
        }

        return rawDataArray
            .map((item, index) => ({
                id: index,
                source: item[0],
                quantity: item[1],
            }));
    };

    const generateIDList = (ids: Array<number>, isOpen: boolean) => {
        const trimList = isOpen ? ids : ids.slice(0, MAX_VISIBLE_IDS);
        const preparedLinks = trimList.map(id => ({
            name: `${id}`,
            to: `${pages.SALES_FUNNEL}/${id}`,
            highlighted: false,
        }));

        return <LinksBlock
            className={classes.ids}
            justify='flex-start'
            separator=';'
            closingSeparator={false}
            links={preparedLinks}
        />;
    };

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
            {translations.sourceStatisticsPerPeriod}
            <IconButton
                className={classes.closeButton}
                onClick={toggleShow}
            >
                <CRMIcon IconComponent={CloseIcon}/>
            </IconButton>
        </DialogTitle>
        <CRMTable
            data={prepareData(statistics)}
            columnsConfig={config}
            isLoading={modalLoading}
            classes={{
                cell: classes.tableCell,
                title: classes.tableTitle,
                root: classes.tableRoot,
            }}
        />
        <Grid container className={classes.total}>
            <Grid className={classes.totalName}>
                {`${translations.total}:`}
            </Grid>
            <Grid>
                {total}
            </Grid>
        </Grid>
        {
            (withoutMainContact.length || null) && <Grid
                className={classes.errorRoot}
            >
                {translations.modalFooterNoSales}
                <Grid className={classes.errorMessageIds}>
                    {generateIDList(withoutMainContact, showMissedSales)}
                    {
                        withoutMainContact.length > MAX_VISIBLE_IDS
                        && <Grid
                            container
                            alignItems='center'
                            onClick={() => setShowMissedSales(state => !state)}
                            className={classes.arrowBlock}
                        >
                            <Grid>
                                {showMissedSales ? translations.hide : translations.showMore}
                            </Grid>
                            <ArrowDropDown
                                className={cn(classes.dropDownIcon, { [classes.closeIcon]: showMissedSales })}
                            />
                        </Grid>
                    }
                </Grid>
                {translations.modalFooterNoSalesBecause}
            </Grid>
        }
    </Dialog>;
};

export default withStyles(styles)(StatisticModal);
