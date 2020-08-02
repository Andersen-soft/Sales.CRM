// @flow

import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMTextArea from 'crm-ui/CRMTextArea/CRMTextArea';

type Props = {
    classes: Object,
    message: string,
    updateEditRowState: (key: string, value: string | Error) => void,
};

const EditableMessage = ({
    classes,
    message,
    updateEditRowState,
}: Props) => {
    const [localMessage, setLocalMessage] = useState(message);
    const [messageError, setMessageError] = useState(null);

    const translations = {
        errorRequiredField: useTranslation('forms.errorRequiredField'),
        enterComment: useTranslation('socialNetworksReplies.common.enterComment'),
    };

    useEffect(() => {
        setLocalMessage(message);
        setMessageError(null);
    }, [message]);

    const onBlurMessage = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        if (!value.trim().length) {
            setMessageError(translations.errorRequiredField);
            updateEditRowState('message', Error(translations.errorRequiredField));
        } else {
            setMessageError(null);
            updateEditRowState('message', value.trim());
        }
    };

    const changeMessage = ({
        target: { value },
    }: SyntheticInputEvent<HTMLInputElement>) => setLocalMessage(value);

    return <Grid
        container
        direction='column'
        item
        className={classes.cell}
    >
        <CRMTextArea
            fullWidth
            multiline
            InputLabelProps={{ shrink: true }}
            value={localMessage}
            onBlur={onBlurMessage}
            onChange={changeMessage}
            variant='outlined'
            InputProps={{
                classes: {
                    input: classes.textAreaInput,
                },
            }}
            rows={1}
            rowsMax={5}
            placeholder={translations.enterComment}
            error={messageError}
        />
    </Grid>;
};

export default EditableMessage;
