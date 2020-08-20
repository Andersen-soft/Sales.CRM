// @flow

import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    IconButton,
    Grid,
    Paper,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMIcon from 'crm-icons';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import AddSaleForm from '../AddSaleForm';
import styles from './styles';

type Props = {
    classes: Object,
    open: boolean,
    showConfirmationDialog: boolean,
    onModalClose: () => void,
    onHandleOpenModal: () => void,
    switchExported: () => void,
}

const AddSaleModal = ({
    classes,
    open,
    showConfirmationDialog,
    onHandleOpenModal,
    switchExported,
}: Props) => {
    const [showConfirmationDialogState, setShowConfirmationDialogState] = useState(false);

    const translations = {
        addTo1C: useTranslation('sale.companySection.addTo1C.addTo1C'),
        notificationCancel: useTranslation('sale.companySection.addTo1C.notificationCancel'),
        notificationSuccess: useTranslation('sale.companySection.addTo1C.notificationSuccess'),
    };

    const handleConfirmationDialogOpen = () => setShowConfirmationDialogState(true);

    const handleConfirmationDialogClose = () => setShowConfirmationDialogState(false);

    const handleOnClose = () => {
        handleConfirmationDialogClose();
        onHandleOpenModal();
    };

    return (
        <Dialog
            open={open}
            onClose={handleConfirmationDialogOpen}
            classes={{ paper: classes.containerDialog }}
        >
            <Paper className={classes.containerPaper}>
                <DialogTitle
                    classes={{ root: classes.title }}
                    disableTypography
                >
                    <Grid container>
                        {translations.addTo1C}
                        <IconButton
                            className={classes.exitButton}
                            onClick={handleConfirmationDialogOpen}
                        >
                            <CRMIcon IconComponent={Close} />
                        </IconButton>
                    </Grid>
                </DialogTitle>
                <AddSaleForm
                    onHandleOnClose={handleOnClose}
                    onHandleConfirmationOpen={handleConfirmationDialogOpen}
                    switchExported={switchExported}
                    notificationSuccess={translations.notificationSuccess}
                />
                <CancelConfirmation
                    showConfirmationDialog={showConfirmationDialogState}
                    onConfirmationDialogClose={handleConfirmationDialogClose}
                    onConfirm={handleOnClose}
                    text={translations.notificationCancel}
                    textAlignCenter
                />
            </Paper>
        </Dialog>
    );
};

export default withStyles(styles)(AddSaleModal);
