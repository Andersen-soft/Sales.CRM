// @flow

import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMTextArea from 'crm-ui/CRMTextArea/CRMTextArea';

type Props = {
    classes: Object,
    message: string,
    updateEditRowState: (string) => Promise<void>,
};

const EditableComment = ({
    classes,
    message,
    updateEditRowState,
}: Props) => {
    const [localMessage, setLocalMessage] = useState(message);

    const translations = {
        enterComment: useTranslation('socialNetworksReplies.common.enterComment'),
    };

    useEffect(() => {
        setLocalMessage(message);
    }, [message]);

    const onBlurMessage = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        updateEditRowState(value.trim());
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
            InputProps={{ classes: { input: classes.textAreaInput } }}
            rows={1}
            rowsMax={5}
            placeholder={translations.enterComment}
        />
    </Grid>;
};

export default EditableComment;
