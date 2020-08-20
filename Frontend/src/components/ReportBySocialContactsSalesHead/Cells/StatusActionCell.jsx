// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { pathOr } from 'ramda';
import { Grid, IconButton } from '@material-ui/core';
import CRMIcon from 'crm-ui/CRMIcons';
import {
    statusConfig,
    APPLY,
    REJECT,
    AWAIT,
} from 'crm-constants/reportBySocialContactsSalesHead/reportBySocialContactsSalesHead';
import Undo from 'crm-static/customIcons/undo.svg';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './cellStyles';

type Props = {
    classes: Object,
    values: [number, string, (number) => void],
};

const StatusActionCell = ({
    classes,
    values: [id, status, setUndoAnswerId],
}: Props) => {
    const getStatusKey = (statusProps: string) => {
        switch (true) {
            case (statusProps === 'Ожидает'):
                return AWAIT;
            case (statusProps === 'Принято'):
                return APPLY;
            case (statusProps === 'Отклонено'):
                return REJECT;
            default: return '';
        }
    };

    const translations = {
        undo: useTranslation('allSocialNetworkAnswers.undo'),
        status: useTranslation(pathOr('', [getStatusKey(status), 'title'], statusConfig)),
    };

    return (
        <Grid
            container
            direction='column'
        >
            <Grid
                container
                alignItems='center'
            >
                <CRMIcon
                    IconComponent={pathOr(null, [getStatusKey(status), 'icon'], statusConfig)}
                    className={classes.statusIcon}
                />
                {translations.status}
            </Grid>
            {getStatusKey(status) === 'REJECT' && <Grid className={classes.actionUndo}>
                <IconButton
                    className={classes.undoButton}
                    onClick={() => setUndoAnswerId(id)}
                    disableRipple
                >
                    <CRMIcon
                        IconComponent={Undo}
                        className={classes.icon}
                    />
                    <Grid className={classes.label}>{translations.undo}</Grid>
                </IconButton>
            </Grid>}
        </Grid>
    );
};

export default withStyles(styles)(StatusActionCell);
