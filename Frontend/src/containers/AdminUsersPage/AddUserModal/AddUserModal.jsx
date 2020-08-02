// @flow

import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    IconButton,
    Grid,
    Paper,
    Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import UserForm from './UserForm';

import type { ISaleProps } from 'crm-types/adminUsers';

import styles from './styles';

type Props = {
    classes: Object,
    open: boolean,
    setUsers: () => void,
    onToggleModal: () => void,
} & ISaleProps;

const AddUserModal = ({
    classes,
    open,
    setUsers,
    onToggleModal,
    fetchSales,
    sales,
    isSalesLoading,
}: Props) => {
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    const handleOnClose = () => {
        setShowConfirmationDialog(false);
        onToggleModal();
    };

    return (
        <Dialog
            open={open}
            onClose={() => setShowConfirmationDialog(true)}
            classes={{ paper: classes.container }}
        >
            <Paper classes={{ root: classes.wrapper }}>
                <DialogTitle classes={{ root: classes.title }}>
                    <Grid
                        container
                        justify='center'
                    >
                        Добавить пользователя
                        <IconButton
                            className={classes.exitButton}
                            onClick={() => setShowConfirmationDialog(true)}
                        >
                            <Close fontSize='small' />
                        </IconButton>
                    </Grid>
                    <Grid
                        container
                        justify='center'
                    >
                        <Typography
                            className={classes.hint}
                            variant='body2'
                        >
                            В случае использования корпоративного e-mail новый пользователь
                            сможет войти в систему, используя корпоративные логин и пароль
                            Andersen (как при входе в Jira, Wiki, mail.ru).
                        </Typography>
                    </Grid>
                </DialogTitle>
                <UserForm
                    classes={classes}
                    onHandleConfirmationDialogOpen={() => setShowConfirmationDialog(true)}
                    onHandleConfirmationDialogClose={() => setShowConfirmationDialog(false)}
                    onHandleOnClose={handleOnClose}
                    showConfirmationDialog={showConfirmationDialog}
                    setUsers={setUsers}
                    fetchSales={fetchSales}
                    sales={sales}
                    isSalesLoading={isSalesLoading}
                />
            </Paper>
        </Dialog>
    );
};

export default withStyles(styles)(AddUserModal);
