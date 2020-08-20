// @flow

import React from 'react';
import {
    Dialog,
    DialogTitle,
    Grid,
    DialogActions,
} from '@material-ui/core';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import { useTranslation } from 'crm-hooks/useTranslation';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './styles';

type Props = {
    showConfirmationDialog: () => void,
    onConfirmationDialogClose: () => void,
    onConfirm: () => void,
    text: string | HTMLElement,
    textApply?: string,
    textCancel?: string,
    textAlignCenter?: boolean,
} & StyledComponentProps

const CancelConfirmation = ({
    classes,
    showConfirmationDialog,
    onConfirmationDialogClose,
    onConfirm,
    text,
    textApply = useTranslation('common.yes'),
    textCancel = useTranslation('common.no'),
    textAlignCenter = true,
}: Props) => {
    const renderButtons = () => (
        <>
            <Grid
                item
                className={classes.buttonContainer}
            >
                <CRMButton
                    onClick={onConfirmationDialogClose}
                    size='large'
                >
                    {textCancel}
                </CRMButton>
            </Grid>
            <Grid item>
                <CRMButton
                    onClick={onConfirm}
                    primary
                    size='large'
                >
                    {textApply}
                </CRMButton>
            </Grid>
        </>
    );

    return (
        <Dialog
            disableRestoreFocus
            open={showConfirmationDialog}
            onClose={onConfirmationDialogClose}
            PaperProps={{
                classes: { root: classes.root },
            }}
        >
            <DialogTitle disableTypography>
                <Grid
                    container
                    justify='center'
                    className={cn(classes.text, { [classes.textAlignCenter]: textAlignCenter })}
                >
                    {text}
                </Grid>
            </DialogTitle>
            <DialogActions className={classes.actions}>
                <Grid
                    container
                    justify='center'
                >
                    {renderButtons()}
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

export default withStyles(styles)(CancelConfirmation);
