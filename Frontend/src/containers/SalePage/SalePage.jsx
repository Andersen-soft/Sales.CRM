// @flow

import React, { useState, useEffect } from 'react';
import { path, pathOr } from 'ramda';
import { Grid, Dialog } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import {
    clearSaleStore as claerSaleStoreAction,
    fetchSale as fetchSaleAction,
} from 'crm-actions/salePageActions/salePageActions';
import Notification from 'crm-components/notification/NotificationSingleton';
import { getDefaultPage } from 'crm-helpers/navigation';
import { approveSale } from 'crm-api/saleService';
import { useTranslation } from 'crm-hooks/useTranslation';
import crmSocket, { SUBSCRIPTIONS_PAGE_KEYS as KEYS } from 'crm-helpers/api/crmSocket';
import { RETURN_TO_QUEUE, SALE_IN_DAY_AUTO_DISTRIBUTION } from 'crm-constants/common/constants';
import SaleCard from './SaleCard';
import CompanyCard from './CompanyCard';
import ContactsCard from './ContactsCard';
import ActivitiesHistoryTable from './ActivitiesHistory';

import type { Sale as SaleType } from './SaleCard';
import type { Router } from 'react-router-dom';

import styles from './SalePageStyle';

type Props = {
    classes: Object,
    routeParams: {
        saleId: string,
    },
    userData: {roles: Array<string>, id: number},
    history: Router,
    clearSaleStore: () => void,
    sale: SaleType,
    fetchSale: (number) => Promise<void>,
}

const SalePage = ({
    classes,
    routeParams: { saleId },
    history,
    userData: { roles, id },
    clearSaleStore,
    sale,
    fetchSale,
}: Props) => {
    const [correctUrl, setCorrectUrl] = useState(false);
    const [showAcceptDialog, setShowAcceptDialog] = useState(false);

    const translations = {
        accept: useTranslation('common.accept'),
        crmBot: useTranslation('sale.crmBot'),
        distributionNotification: useTranslation('sale.distributionNotification'),
        notificationDataNotProcessed: useTranslation('socialNetworksReplies.notification.notificationDataNotProcessed'),
    };

    const saleNumberId = Number(saleId);

    const closeAcceptDialog = () => {
        setShowAcceptDialog(false);
        fetchSale(saleNumberId);
    };

    const checkDayAutoDistribution = socketMessage => {
        const { companySaleId, employeeId } = JSON.parse(socketMessage.body);

        if (saleNumberId !== companySaleId) {
            return;
        }

        id === employeeId
            ? setShowAcceptDialog(true)
            : closeAcceptDialog();
    };

    const checkReturnToQueue = socketMessage => {
        const { companySaleId, employeeId } = JSON.parse(socketMessage.body);

        (saleNumberId === companySaleId) && (id === employeeId) && closeAcceptDialog();
    };

    useEffect(() => {
        if (Number.isNaN(+saleId)) {
            Notification.showMessage({
                message: `Warning! Sale ${saleId} does not exist.`,
                type: 'warning',
                closeTimeout: 15000,
            });
            history.push(getDefaultPage(roles || []));
        } else {
            fetchSale(saleNumberId)
                .then(() => {
                    crmSocket.subscribe(SALE_IN_DAY_AUTO_DISTRIBUTION, checkDayAutoDistribution, KEYS.Sale);
                    crmSocket.subscribe(RETURN_TO_QUEUE, checkReturnToQueue, KEYS.Sale);

                    crmSocket.activate();
                    setCorrectUrl(true);
                })
                .catch(error => {
                    if (path(['response', 'status'], error) !== 401) {
                        Notification.showMessage({
                            message: `Warning! Sale ${saleId} does not exist.`,
                            type: 'warning',
                            closeTimeout: 15000,
                        });
                        history.push(getDefaultPage(roles || []));
                    }
                });
        }

        return () => {
            crmSocket.deactivate(KEYS.Sale);
            clearSaleStore();
        };
    }, [saleId]);

    useEffect(() => {
        const { inDayAutoDistribution, distributedEmployeeId } = sale;

        if (inDayAutoDistribution && (distributedEmployeeId === id)) {
            setShowAcceptDialog(true);
        }
    }, [sale]);

    const onAcceptSale = async () => {
        try {
            await approveSale(saleNumberId);
        } catch (error) {
            Notification.showMessage({
                message: pathOr(translations.notificationDataNotProcessed, ['response', 'data', 'errorMessage'], error),
                closeTimeout: 15000,
            });
        }
        closeAcceptDialog();
    };

    return correctUrl && (
        <Grid
            className={classes.scroll}
            key={saleNumberId}
        >
            <Grid container className={classes.container}>
                <Grid
                    container
                    justify='flex-end'
                    className={classes.topContainer}
                >
                    <Grid
                        item
                        xs={12} sm={4}
                        className={classes.saleCard}
                    >
                        <SaleCard />
                    </Grid>
                    <Grid
                        item
                        xs={12} sm={8}
                        className={classes.rightBlock}
                    >
                        <Grid
                            item
                            className={classes.companyCard}
                        >
                            <CompanyCard saleId={saleNumberId} />
                        </Grid>
                        <Grid
                            item
                            className={classes.contactsCard}
                        >
                            <ContactsCard saleId={saleNumberId} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid
                        item
                        xs={12}
                        className={classes.activitiesHistory}
                    >
                        <ActivitiesHistoryTable saleId={saleNumberId} />
                    </Grid>
                </Grid>
            </Grid>
            <Dialog
                onClose={() => setShowAcceptDialog(false)}
                open={showAcceptDialog}
                className={classes.dialogConfirmation}
            >
                <Grid item className={classes.dialogConfirmationTitle}>
                    <strong className={classes.bold}>{translations.crmBot} </strong>
                    {translations.distributionNotification} {sale.company.name}
                </Grid>
                <Grid container justify='center'>
                    <CRMButton
                        primary
                        onClick={onAcceptSale}
                        className={classes.dialogConfirmationButton}
                    >
                        {translations.accept}
                    </CRMButton>
                </Grid>
            </Dialog>
        </Grid>
    );
};

const mapStateToProps = state => ({
    userData: state.session.userData,
    sale: state.SaleCard.sale,
});

const mapDispatchToProps = {
    clearSaleStore: claerSaleStoreAction,
    fetchSale: fetchSaleAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SalePage));
