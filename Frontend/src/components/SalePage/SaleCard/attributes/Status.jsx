// @flow

import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ARCHIVE, type SalesStatusKeyType } from 'crm-constants/desktop/statuses';
import applyForUsers from 'crm-utils/sales/applyForUsers';
import CRMStatusSelect from 'crm-components/common/CRMStatusSelect/CRMStatusSelect';
import { useTranslation } from 'crm-hooks/useTranslation';
import SaveToArchiveModal from './SaveToArchiveModal';

import type { Sale } from 'crm-types/sales';
import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './AttributesStyles';

type Props = {
    sale: Sale,
    updateHandler: ({status: string}) => void,
    userRoles: Array<string>,
    availableToUser: boolean,
} & StyledComponentProps

const Status = ({
    sale,
    updateHandler,
    userRoles,
    availableToUser,
    classes,
}: Props) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const translations = {
        status: useTranslation('sale.saleSection.status'),
    };

    const toogleShowDialog = () => setShowConfirmDialog(!showConfirmDialog);

    const updateSale = (status: string) => updateHandler({ status });

    const handleConfirmDialog = comment => {
        updateHandler({ description: comment, status: ARCHIVE });
        toogleShowDialog();
    };

    const handleChange = async (status:SalesStatusKeyType) => {
        if (status === ARCHIVE) {
            toogleShowDialog();
        } else {
            await updateSale(status);
        }
    };

    return (
        <Grid
            item
            container
            direction='row'
            justify='space-between'
            alignItems='center'
            xs={12}
            wrap='nowrap'
        >
            <Grid className={classes.label}>
                {`${translations.status}:`}
            </Grid>
            <Grid>
                <CRMStatusSelect
                    isEditable={applyForUsers(availableToUser, userRoles)}
                    selectedStatus={sale.status}
                    onStatusChange={handleChange}
                />
            </Grid>
            <SaveToArchiveModal
                open={showConfirmDialog}
                onClose={toogleShowDialog}
                onConfirm={handleConfirmDialog}
                sale={sale}
            />
        </Grid>
    );
};

export default withStyles(styles)(Status);
