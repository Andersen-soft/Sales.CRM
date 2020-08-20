// @flow

import React, { useState } from 'react';
import {
    IconButton,
    Grid,
    Tooltip,
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import CRMIcon from 'crm-icons';
import { Delete } from '@material-ui/icons';
import { pages } from 'crm-constants/navigation';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './AttributesStyles';

type Props = {
    estimationId: number,
    classes: Object,
    history: Object,
    deleteEstimation: (number) => void;
    estimationsTotal: number,
}

const Header = ({
    estimationId,
    classes,
    history,
    deleteEstimation,
    estimationsTotal,
}: Props) => {
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    const translations = {
        notificationDeleteEstimation: useTranslation('requestForEstimation.requestSection.notificationDeleteEstimation'),
        delete: useTranslation('components.tooltip.delete'),
    };

    const deleteRequest = async () => {
        try {
            await deleteEstimation(estimationId);
            setShowConfirmationDialog(false);
            history.push(pages.ESTIMATION_REQUEST_ALL);
        } catch (error) {
            setShowConfirmationDialog(false);
        }
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
            <Grid className={classes.headerId}>
                {`#${estimationId}`}
            </Grid>
            <Grid>
                {
                    !estimationsTotal && <Grid>
                        <Tooltip title={translations.delete}>
                            <IconButton
                                className={classes.headerIcon}
                                onClick={() => setShowConfirmationDialog(true)}
                            >
                                <CRMIcon IconComponent={Delete} />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                }
            </Grid>
            <CancelConfirmation
                showConfirmationDialog={showConfirmationDialog}
                onConfirmationDialogClose={() => setShowConfirmationDialog(false)}
                onConfirm={deleteRequest}
                text={translations.notificationDeleteEstimation}
            />
        </Grid>
    );
};

export default withRouter(withStyles(styles)(Header));
