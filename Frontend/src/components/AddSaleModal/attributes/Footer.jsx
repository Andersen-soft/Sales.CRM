// @flow

import React from 'react';
import {
    Grid,
    DialogActions,
} from '@material-ui/core';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';

type Props = {
    classes: Object,
    handleConfirmationDialogOpen: () => void,
    showConfirmationDialog: boolean,
    setShowConfirmationDialog: (show: boolean) => void,
    onClose: () => void,
};

const Footer = ({
    classes,
    handleConfirmationDialogOpen,
    showConfirmationDialog,
    setShowConfirmationDialog,
    onClose,
}: Props) => {
    const translations = {
        save: useTranslation('common.save'),
        cancel: useTranslation('common.cancel'),
        dialogCancel: useTranslation('header.reportAddSale.dialogCancel'),
    };

    return <DialogActions className={classes.actions}>
        <Grid
            container
            justify='center'
            spacing={2}
            className={classes.buttonsContainer}
        >
            <Grid item>
                <CRMButton
                    onClick={handleConfirmationDialogOpen}
                    size='large'
                >
                    {translations.cancel}
                </CRMButton>
            </Grid>
            <Grid item>
                <CRMButton
                    primary
                    type='submit'
                    size='large'
                >
                    {translations.save}
                </CRMButton>
            </Grid>
            <CancelConfirmation
                showConfirmationDialog={showConfirmationDialog}
                onConfirmationDialogClose={() => setShowConfirmationDialog(false)}
                onConfirm={onClose}
                text={translations.dialogCancel}
            />
        </Grid>
    </DialogActions>;
};

export default Footer;
