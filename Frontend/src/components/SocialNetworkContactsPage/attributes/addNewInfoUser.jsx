// @flow

import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Grid,
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
} from '@material-ui/core';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './TableSocialNetworkStyles';

type Config = {
    placeholder: string,
    onAdd: (item: string) => void,
}

type Props = {
    classes: Object,
    config: Config,
    openNewInfo: boolean,
    closeNewInfo: (show: boolean) => void,
    newInfo: string,
    errorMessage: string | null,
    setErrorMessage: (string | null) => void,
};

const addNewInfoUser = ({
    classes,
    openNewInfo,
    closeNewInfo,
    config: {
        placeholder,
        onAdd,
    },
    newInfo,
    errorMessage,
    setErrorMessage,
}: Props) => {
    const [info, setInfo] = useState(newInfo);
    const [error, setError] = useState(false);

    const translations = {
        cancel: useTranslation('common.cancel'),
        add: useTranslation('common.add'),
        error: useTranslation('forms.errorInputRequired'),
    };

    useEffect(() => {
        openNewInfo && setInfo(newInfo);
    }, [openNewInfo]);

    const handleChange = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => setInfo(value);

    const cancelForm = () => {
        closeNewInfo(false);
        setError(false);
        setInfo('');
        setErrorMessage(null);
    };

    const checkError = () => (info.length ? onAdd(info) : setError(true));

    return (
        <Dialog
            open={openNewInfo}
            onClose={cancelForm}
        >
            <DialogContent>
                <Grid
                    container
                    alignItems='center'
                >
                    <CRMInput
                        placeholder={placeholder}
                        fullWidth
                        error={error && translations.error}
                        value={info}
                        onChange={handleChange}
                    />
                    {errorMessage && <Typography className={classes.errorMessage}>
                        {errorMessage}
                    </Typography>}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid
                    container
                    justify='center'
                >
                    <Grid item className={classes.dialogActions}>
                        <CRMButton
                            onClick={cancelForm}
                            size='large'
                        >
                            {translations.cancel}
                        </CRMButton>
                    </Grid>
                    <Grid item className={classes.dialogActions}>
                        <CRMButton
                            primary
                            type='submit'
                            size='large'
                            onClick={checkError}
                        >
                            {translations.add}
                        </CRMButton>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

export default withStyles(styles)(addNewInfoUser);
