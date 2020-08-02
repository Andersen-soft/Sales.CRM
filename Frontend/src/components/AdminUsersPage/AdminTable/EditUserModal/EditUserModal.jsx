// @flow

import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    IconButton,
    Grid,
    Paper,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import EditUserForm from './EditUserForm';

import type { ISaleProps } from 'crm-types/adminUsers';

import styles from './styles';

type Props = {
    classes: Object,
    users: Object,
    open: boolean,
    editId: number,
    onToggleModal: () => void,
    setUsers: () => void,
} & ISaleProps;

const EditUserModal = ({
    classes,
    open,
    editId,
    users,
    setUsers,
    sales,
    isSalesLoading,
    fetchSales,
    onToggleModal,
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
                        Редактирование пользователя
                        <IconButton
                            className={classes.exitButton}
                            onClick={() => setShowConfirmationDialog(true)}
                        >
                            <Close fontSize='small' />
                        </IconButton>
                    </Grid>
                </DialogTitle>
                <EditUserForm
                    classes={classes}
                    editId={editId}
                    users={users}
                    setUsers={setUsers}
                    onHandleConfirmationDialogOpen={() => setShowConfirmationDialog(true)}
                    onHandleConfirmationDialogClose={() => setShowConfirmationDialog(false)}
                    onHandleOnClose={handleOnClose}
                    showConfirmationDialog={showConfirmationDialog}
                    sales={sales}
                    isSalesLoading={isSalesLoading}
                    fetchSales={fetchSales}
                />
            </Paper>
        </Dialog>
    );
};

export default withStyles(styles)(EditUserModal);
