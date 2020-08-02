// @flow

import React from 'react';
import {
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    IconButton,
} from '@material-ui/core';
import { pathOr } from 'ramda';
import { withStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CRMIcon from 'crm-icons';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './ExistsCompanyDialogStyles';

type responsibleRmType = {
    firstName: 'string',
    lastName: 'string',
    responsibleRm: boolean,
}

type Props = {
    classes: Object,
    status: Object,
    company: {
        name: string,
        responsibleRm: responsibleRmType,
    },
    onHandleExistsCompanyDialogClose: () => void,
    onHandleExistsCompanyDialogContinue: () => void,
};

const ExistsCompanyDialog = ({
    classes,
    status,
    company,
    onHandleExistsCompanyDialogClose,
    onHandleExistsCompanyDialogContinue,
}: Props) => {
    const translations = {
        cancel: useTranslation('common.cancel'),
        continue: useTranslation('common.continue'),
        company: useTranslation('header.reportAddSale.existsCompany.company'),
        exists: useTranslation('header.reportAddSale.existsCompany.exists'),
        ifContinue: useTranslation('header.reportAddSale.existsCompany.ifContinue'),
        fieldsNotSave: useTranslation('header.reportAddSale.existsCompany.fieldsNotSave'),
        whereDD: useTranslation('header.reportAddSale.existsCompany.whereDD'),
        empty: useTranslation('header.reportAddSale.existsCompany.empty'),
    };

    const getResponsibleRm = () => {
        const { responsibleRm } = company;

        return pathOr(null, ['responsibleRM'], responsibleRm)
            ? `${responsibleRm.firstName} ${responsibleRm.lastName}`
            : translations.empty;
    };

    return company && <Dialog
        disableRestoreFocus
        open={status.showExistsCompanyDialog}
        onClose={onHandleExistsCompanyDialogClose}
        classes={{ paper: classes.dialogContainer }}
    >
        <DialogTitle classes={{ root: classes.title }}>
            <Grid
                container
                justify='space-between'
            >
                <Grid>
                    {translations.company}
                    <strong className={classes.bold}>{` '${company.name}' `}</strong>
                    {translations.exists}
                </Grid>
                <IconButton
                    className={classes.exitButton}
                    onClick={onHandleExistsCompanyDialogClose}
                >
                    <CRMIcon IconComponent={Close} />
                </IconButton>
            </Grid>
        </DialogTitle>
        <DialogContent>
            <Grid container>
                <Typography className={classes.paragraph}>
                    {translations.ifContinue}
                    <strong className={classes.bold}>{` '${company.name}'`}</strong>,
                    {` ${translations.whereDD} ${getResponsibleRm()}.`}
                </Typography>
                <Typography>
                    {translations.fieldsNotSave}.
                </Typography>
            </Grid>
        </DialogContent>
        <DialogActions className={classes.buttonWrapper}>
            <Grid
                container
                justify='center'
            >
                <Grid
                    item
                    className={classes.buttonContainer}
                >
                    <CRMButton
                        onClick={onHandleExistsCompanyDialogClose}
                        size='large'
                    >
                        {translations.cancel}
                    </CRMButton>
                </Grid>
                <Grid item>
                    <CRMButton
                        onClick={onHandleExistsCompanyDialogContinue}
                        primary
                        size='large'
                    >
                        {translations.continue}
                    </CRMButton>
                </Grid>
            </Grid>
        </DialogActions>
    </Dialog>;
};

export default withStyles(styles)(ExistsCompanyDialog);
