// @flow

import React from 'react';
import {
    Dialog,
    DialogActions,
    Button,
    DialogContent,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import styles from './CRMInformationDialogStyles';
import type { StyledComponentProps } from '@material-ui/core/es/index';

type Props = {
    open: boolean,
    onClose: () => void,
    renderContent: () => Node,
} & StyledComponentProps

const CRMInformationDialog = ({
    open,
    onClose,
    renderContent,
    classes,
}: Props) => (
    <Dialog
        disableRestoreFocus
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth={false}
        classes={{
            root: classes.root,
            paper: classes.paper,
            paperFullWidth: classes.paperFullWidth,
            paperWidthFalse: classes.paperWidthFalse,
        }}
    >
        <DialogContent
            classes={{ root: classes.contentRoot }}
        >
            {renderContent()}
        </DialogContent>
        <DialogActions
            classes={{ root: classes.actionRoot }}
        >
            <Button
                onClick={onClose}
                className={classes.closeButton}
            >
                Закрыть
            </Button>
        </DialogActions>
    </Dialog>
);

export default withStyles(styles)(CRMInformationDialog);
