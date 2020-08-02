// @flow

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
} from '@material-ui/core';
import { pathOr } from 'ramda';
import { withStyles } from '@material-ui/core/styles';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMTextArea from 'crm-ui/CRMTextArea/CRMTextArea';

import type { Sale } from 'crm-types/sales';

import styles from './AttributesStyles';

type Props = {
    open: boolean,
    onClose: () => void,
    onConfirm: (comment: string) => void,
    classes: Object,
    sale: Sale,
};

const SaveToArchiveModal = ({
    open,
    onClose,
    onConfirm,
    classes,
    sale,
}: Props) => {
    const [localComment, setLocalComment] = useState('');

    const translations = {
        archivingSale: useTranslation('sale.saleSection.archivingSale'),
        leaveAComment: useTranslation('sale.saleSection.leaveAComment'),
        comment: useTranslation('sale.saleSection.comment'),
        cancel: useTranslation('common.cancel'),
        changeStatus: useTranslation('common.changeStatus'),
    };

    useEffect(() => {
        setLocalComment(pathOr('', ['description'], sale));
    }, [sale.description, open]);

    return (
        <Dialog
            disableRestoreFocus
            open={open}
            onClose={onClose}
            PaperProps={{
                classes: { root: classes.modalRoot },
            }}
        >
            <DialogTitle disableTypography>
                <Grid className={classes.text}>
                    {translations.archivingSale}
                </Grid>
            </DialogTitle>
            <DialogContent>
                <Grid className={classes.contentText}>
                    {translations.leaveAComment}
                </Grid>
                <CRMTextArea
                    fullWidth
                    value={localComment}
                    label={translations.comment}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                        classes: { input: classes.commentInput },
                    }}
                    onChange={({ target: { value } }) => setLocalComment(value)}
                    className={classes.commentField}
                    rows={6}
                    rowsMax={6}
                />
            </DialogContent>
            <DialogActions className={classes.actions}>
                <Grid
                    container
                    justify='center'
                >
                    <Grid
                        item
                        className={classes.buttonContainer}
                    >
                        <CRMButton
                            onClick={onClose}
                            size='large'
                        >
                            {translations.cancel}
                        </CRMButton>
                    </Grid>
                    <Grid item>
                        <CRMButton
                            onClick={() => onConfirm(localComment)}
                            size='large'
                            disabled={!localComment || localComment === sale.description}
                            primary
                        >
                            {translations.changeStatus}
                        </CRMButton>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

export default withStyles(styles)(SaveToArchiveModal);
