// @flow

import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
} from '@material-ui/core';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import CRMIcon from 'crm-icons';

import styles from './CRMModalStyles';

type Props = {
    classes: Object,
    title: ?string,
    size: string,
    ContentComponent: React$Element<>,
    isDialogOpened: boolean,
    actions: boolean,
    onHandleConfirmationDialogOpen: () => void,
    onHandleSubmit: () => void,
};

const CRMModal = ({
    classes,
    title,
    size,
    ContentComponent,
    isDialogOpened,
    actions,
    onHandleConfirmationDialogOpen,
    onHandleSubmit,
}: Props) => (
    <Dialog
        open={isDialogOpened}
        scroll='paper'
        maxWidth='md'
        PaperProps={{
            classes: {
                root: cn(classes.root, classes[size]),
            },
        }}
    >
        <DialogTitle className={classes.title}>
            <Grid
                container alignItems='center'
                justify='flex-start'
            >
                {title}
            </Grid>
            <IconButton
                aria-label='Close'
                className={classes.closeButton}
                onClick={onHandleConfirmationDialogOpen}
            >
                <CRMIcon IconComponent={CloseIcon} />
            </IconButton>
        </DialogTitle>
        <DialogContent>
            {ContentComponent}
        </DialogContent>
        {actions && <DialogActions className={classes.actions}>
            <Grid container justify='center'>
                <CRMButton onClick={onHandleConfirmationDialogOpen} className={classes.confirmationButton}>
                    Отменить
                </CRMButton>
                <CRMButton
                    onClick={onHandleSubmit}
                    variant='action'
                    className={cn(classes.saveBtn, classes.confirmationButton)}
                >
                    Сохранить
                </CRMButton>
            </Grid>
        </DialogActions>}
    </Dialog>
);

export default withStyles(styles)(CRMModal);
