// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, IconButton, Tooltip } from '@material-ui/core';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import { Delete } from '@material-ui/icons';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMIcon from 'crm-icons';
import styles from '../AttributesDesktopStyles';

type Props = {
    classes: Object,
    resumeId: number,
    disableDeletedButton: boolean,
    handleDeletePopoverOpen: () => void,
    showConfirmationDialog: boolean,
    handleConfirmationDialogClose: () => void,
    deleteRequest: () => void,
    translateNotificationDeleteCv: string,
}

const ResumeHeaderDesktop = ({
    classes,
    resumeId,
    disableDeletedButton,
    handleDeletePopoverOpen,
    showConfirmationDialog,
    handleConfirmationDialogClose,
    deleteRequest,
    translateNotificationDeleteCv,
}: Props) => {
    const translations = {
        delete: useTranslation('components.tooltip.delete'),
    };

    return (
        <Grid
            item
            container
            direction='row'
            justify='flex-start'
            alignItems='center'
            xs={12}
        >
            <Grid className={classes.idResume}>
                {`#${resumeId}`}
            </Grid>
            <Grid>
                {!disableDeletedButton && <Tooltip title={translations.delete}>
                    <Grid>
                        <IconButton
                            className={classes.deleteButton}
                            onClick={handleDeletePopoverOpen}
                        >
                            <CRMIcon IconComponent={Delete} />
                        </IconButton>
                    </Grid>
                </Tooltip>
                }
            </Grid>
            <CancelConfirmation
                showConfirmationDialog={showConfirmationDialog}
                onConfirmationDialogClose={handleConfirmationDialogClose}
                onConfirm={deleteRequest}
                text={translateNotificationDeleteCv}
            />
        </Grid>
    );
};

export default withStyles(styles)(ResumeHeaderDesktop);
