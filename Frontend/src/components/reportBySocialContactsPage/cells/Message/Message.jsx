// @flow

import React, { useState, memo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

import CollapsedMessage from './CollapsedMessage';
import EditableMessage from './EditableMessage';

import styles from './MessageStyles';

type Props = {
    classes: Object,
    values: string,
    isEdit: boolean,
    updateEditRowState: (key: string, value: string | Error) => void,
};

const areEqualProps = (prevProps, nextProps) => (prevProps.values === nextProps.values)
    && (prevProps.isEdit === nextProps.isEdit);

const Message = memo < Props > (({
    classes,
    values: message,
    isEdit,
    updateEditRowState,
}: Props) => {
    const [normalMessageHeight, setNormalMessageHeight] = useState(true);

    const updateRow = (key, value) => {
        updateEditRowState(key, value);
        setNormalMessageHeight(true);
    };

    return <Grid
        container
        direction='column'
    >
        {isEdit
            ? <EditableMessage
                message={message}
                classes={classes}
                updateEditRowState={updateRow}
            />
            : <CollapsedMessage
                message={message}
                classes={classes}
                normalMessageHeight={normalMessageHeight}
                setNormalMessageHeight={setNormalMessageHeight}
            />
        }
    </Grid>;
}, areEqualProps); // NOSONAR

export default withStyles(styles)(Message);
