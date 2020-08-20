// @flow

import React from 'react';
import {
    Grid,
    DialogActions,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CancelConfirmation from 'crm-components/common/CancelConfirmation/CancelConfirmation';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './newContactModalStyles';

type Props = {
    classes: Object,
    setSendRequest: () => void,
    sendRequest: boolean,
    handleToggleModal: () => void,
    confirmationDialog: boolean,
    toggleConfirmationDialog: (() => boolean) => void,
}

const ModalFooter = ({
    classes,
    sendRequest,
    setSendRequest,
    confirmationDialog,
    handleToggleModal,
    toggleConfirmationDialog,
}: Props) => {
    const translations = {
        cancel: useTranslation('common.cancel'),
        save: useTranslation('common.save'),
        notificationCancelAdd: useTranslation('sale.contactSection.addContact.notificationCancelAdd'),
    };

    return (
        <DialogActions className={classes.actions}>
            <Grid
                container
                justify='center'
                spacing={2}
                className={classes.buttonsContainer}
            >
                <Grid item>
                    <CRMButton
                        onClick={() => toggleConfirmationDialog(value => !value)}
                        size='large'
                    >
                        {translations.cancel}
                    </CRMButton>
                </Grid>
                <Grid item>
                    <CRMButton
                        primary
                        type='submit'
                        onClick={() => sendRequest && setSendRequest()}
                        size='large'
                    >
                        {translations.save}
                    </CRMButton>
                </Grid>
                <CancelConfirmation
                    showConfirmationDialog={confirmationDialog}
                    onConfirmationDialogClose={() => toggleConfirmationDialog(value => !value)}
                    onConfirm={handleToggleModal}
                    text={translations.notificationCancelAdd}
                />
            </Grid>
        </DialogActions>
    );
};

export default withStyles(styles)(ModalFooter);
