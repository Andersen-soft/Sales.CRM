// @flow

import React from 'react';
import { Tooltip, Grid, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Delete, ChatBubbleOutline } from '@material-ui/icons';
import { useTranslation } from 'crm-hooks/useTranslation';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './cellsStyles';

type Props = {
    values: [
        number,
        string,
        (id: number) => void,
        (string) => void,
    ],
} & StyledComponentProps;

const ActionCell = ({
    values: [
        id,
        fio,
        openConfirmDeleteResume,
        setCommentSubject,
    ],
    classes,
}: Props) => {
    const translations = {
        enterComment: useTranslation('requestForCv.cvSection.enterComment'),
        deleteApplicant: useTranslation('requestForCv.cvSection.deleteApplicant'),
    };

    return (
        <Grid
            item
            className={classes.icons}
        >
            <Tooltip title={translations.deleteApplicant}>
                <IconButton onClick={() => openConfirmDeleteResume(id)}>
                    <Delete />
                </IconButton>
            </Tooltip>
            <Tooltip title={translations.enterComment}>
                <IconButton onClick={() => setCommentSubject(fio)}>
                    <ChatBubbleOutline />
                </IconButton>
            </Tooltip>
        </Grid>
    );
};

export default withStyles(styles)(ActionCell);
