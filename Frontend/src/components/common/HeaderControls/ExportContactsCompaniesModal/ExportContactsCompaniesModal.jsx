// @flow

import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    IconButton,
    Grid,
    Paper,
    Typography,
    Tooltip,
} from '@material-ui/core';
import { saveAs } from 'file-saver';
import { Close } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CRMDateRangeInput from 'crm-components/common/CRMDateRangeInput/CRMDateRangeInput';
import { useTranslation } from 'crm-hooks/useTranslation';
import { exportCompanies, exportContacts, exportCVStatistics } from 'crm-api/exportsCSV/exportsCSV';
import {
    EXPORT_CONTACTS,
    EXPORT_COMPANIES,
    EXPORT_CV_STATISTICS,
} from 'crm-components/common/HeaderControls/HamburgerMenu/Export';
import { FULL_DATE_DS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';

import styles from './styles';

type Props = {
    classes: Object,
    open: true,
    typeModal: string,
    onClose: () => void,
}

const ExportContactsCompaniesModal = ({
    classes,
    open,
    typeModal,
    onClose,
}: Props) => {
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
    });

    const translations = {
        downloadCSV: useTranslation('common.downloadCSV'),
        cancel: useTranslation('common.cancel'),
        download: useTranslation('header.menu.exportModal.download'),
        contacts: useTranslation('header.menu.downloadContacts'),
        companies: useTranslation('header.menu.downloadCompanies'),
        cvStatistics: useTranslation('header.menu.downloadResumeReport'),
        contactCreation: useTranslation('header.menu.exportModal.contactCreation'),
        companyCreation: useTranslation('header.menu.exportModal.companyCreation'),
        cvStatisticsDaterange: useTranslation('header.menu.exportModal.cvStatisticsDaterange'),
    };

    const initializeDate = () => {
        setDateRange({
            startDate: new Date(),
            endDate: new Date(),
        });
    };

    const handleOnClose = () => {
        initializeDate();
        onClose();
    };

    const handleSelectRange = (startDate, endDate) => setDateRange({ startDate, endDate });

    const handleDownload = () => {
        switch (true) {
            case (typeModal === EXPORT_CONTACTS):
                exportContacts({
                    createDateFrom: getDate(dateRange.startDate, FULL_DATE_DS), createDateTo: getDate(dateRange.endDate, FULL_DATE_DS),
                })
                    .then(file => { saveAs(new Blob([file]), 'contacts.csv'); });
                break;
            case (typeModal === EXPORT_COMPANIES):
                exportCompanies({
                    createDateFrom: getDate(dateRange.startDate, FULL_DATE_DS), createDateTo: getDate(dateRange.endDate, FULL_DATE_DS),
                })
                    .then(file => { saveAs(new Blob([file]), 'companies.csv'); });
                break;
            case (typeModal === EXPORT_CV_STATISTICS):
                exportCVStatistics({ from: getDate(dateRange.startDate, FULL_DATE_DS), to: getDate(dateRange.endDate, FULL_DATE_DS) })
                    .then(file => { saveAs(new Blob([file]), 'cvStatistics.csv'); });
                break;
            default: handleOnClose();
        }

        handleOnClose();
    };

    const getModalTitle = () => {
        switch (true) {
            case (typeModal === EXPORT_CONTACTS):
                return translations.contacts;
            case (typeModal === EXPORT_COMPANIES):
                return translations.companies;
            case (typeModal === EXPORT_CV_STATISTICS):
                return translations.cvStatistics;
            default: return '';
        }
    };

    const getMessage = () => {
        switch (true) {
            case (typeModal === EXPORT_CONTACTS):
                return translations.contactCreation;
            case (typeModal === EXPORT_COMPANIES):
                return translations.companyCreation;
            case (typeModal === EXPORT_CV_STATISTICS):
                return translations.cvStatisticsDaterange;
            default:
                return '';
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleOnClose}
            classes={{ paper: classes.container }}
        >
            <Paper>
                <div className={classes.wrapper}>
                    <DialogTitle classes={{ root: classes.header }}>
                        <Grid container>
                            <Typography className={classes.title}>
                                {getModalTitle()}
                            </Typography>
                            <IconButton
                                className={classes.exitButton}
                                onClick={handleOnClose}
                            >
                                <Close fontSize='small' />
                            </IconButton>
                        </Grid>
                    </DialogTitle>
                    <Grid container>
                        <Grid
                            container
                            className={classes.datePickers}
                        >
                            <Grid
                                item
                                className={classes.dateItem}
                            >
                                <CRMDateRangeInput
                                    onSelectRange={handleSelectRange}
                                    className={classes.hint}
                                    startDate={dateRange.startDate}
                                    endDate={dateRange.endDate}
                                    label={getMessage()}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        justify='space-between'
                        className={classes.actions}
                    >
                        <Grid item>
                            <CRMButton
                                size='large'
                                onClick={handleOnClose}
                                className={classes.buttonCancel}
                            >
                                {translations.cancel}
                            </CRMButton>
                        </Grid>
                        <Grid item>
                            <CRMButton
                                variant='action'
                                size='large'
                                onClick={handleDownload}
                            >
                                <Tooltip title='Download with set filters'>
                                    <Typography>
                                        {translations.downloadCSV}
                                    </Typography>
                                </Tooltip>
                            </CRMButton>
                        </Grid>
                    </Grid>
                </div>
            </Paper>
        </Dialog>
    );
};

export default withStyles(styles)(ExportContactsCompaniesModal);

