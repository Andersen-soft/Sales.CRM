// @flow

import React from 'react';
import {
    Tooltip,
    IconButton,
    Grid,
} from '@material-ui/core';
import Save from '@material-ui/icons/Save';
import Close from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import CRMIcon from 'crm-icons';
import CheckboxIndeterminate from '../CheckboxIndeterminate';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './HeaderActionsStyles';

type Props = {
    classes: Object,
    onHandleSave: () => Promise<void>,
    onHandleDelete: () => void,
    onHandleChecked: () => void,
    checkedRowsIds: Array<any>,
    socialNetworkAnswers: Array<any>,
};

const HeaderActions = ({
    classes,
    onHandleSave,
    onHandleDelete,
    onHandleChecked,
    checkedRowsIds,
    socialNetworkAnswers,
}: Props) => {
    const translations = {
        saveAll: useTranslation('socialNetworksReplies.common.saveAll'),
        rejectAll: useTranslation('socialNetworksReplies.common.rejectAll'),
    };

    return (
        <Grid
            container
            justify='flex-end'
            wrap='nowrap'
            className={classes.container}
        >
            {checkedRowsIds.length > 0 && (
                <>
                    <Tooltip
                        title={translations.saveAll}
                        className={classes.tooltip}
                    >
                        <IconButton
                            onClick={onHandleSave}
                            className={classes.button}
                        >
                            <CRMIcon
                                className={classes.icon}
                                IconComponent={Save}
                            />
                        </IconButton>
                    </Tooltip>
                    <Tooltip
                        title={translations.rejectAll}
                        className={classes.tooltip}
                    >
                        <IconButton
                            onClick={onHandleDelete}
                            className={classes.button}
                        >
                            <CRMIcon
                                className={classes.icon}
                                IconComponent={Close}
                            />
                        </IconButton>
                    </Tooltip>
                </>
            )}
            <CheckboxIndeterminate
                onHandleChecked={onHandleChecked}
                checkedRows={checkedRowsIds.length}
                maxRows={socialNetworkAnswers.length}
            />
        </Grid>
    );
};

export default withStyles(styles)(HeaderActions);
