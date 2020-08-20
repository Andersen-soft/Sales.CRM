// @flow

import React, { useState, Fragment } from 'react';
import { Edit as EditIcon, Delete as DeleteIcon, MoreVert } from '@material-ui/icons';
import {
    Popover,
    Grid,
    IconButton,
    Typography,
    Tooltip,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { useTranslation } from 'crm-hooks/useTranslation';
import styles from './MoreActionsPopoverStyles';

type Props = {
    classes: Object,
    commentId: number,
    onCommentEdit: (commendId: number) => void,
    onCommentDelete: (commentId: number) => void,
};

const MoreActionsPopover = ({
    classes,
    commentId,
    onCommentEdit,
    onCommentDelete,
}: Props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const translations = {
        edit: useTranslation('common.edit'),
        delete: useTranslation('common.delete'),
    };

    return (
        <Fragment>
            <Tooltip title={translations.edit}>
                <MoreVert
                    className={classes.buttons}
                    onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
                />
            </Tooltip>
            <Popover
                open={open}
                anchorEl={anchorEl}
                classes={{ paper: classes.customPopover }}
                onClose={() => setAnchorEl(null)}
            >
                <Grid
                    container
                    direction='column'
                >
                    <Grid
                        item
                        xs={12}
                        className={classes.row}
                    >
                        <IconButton
                            className={classes.actionButtons}
                            disableTouchRipple
                            onClick={() => {
                                onCommentEdit(commentId);
                                setAnchorEl(null);
                            }}
                        >
                            <EditIcon />
                            <Typography className={classes.actionLabels}>{translations.edit}</Typography>
                        </IconButton>
                    </Grid>
                    <Grid
                        item xs={12}
                        className={classes.row}
                    >
                        <IconButton
                            className={classes.actionButtons}
                            disableTouchRipple
                            onClick={() => {
                                onCommentDelete(commentId);
                                setAnchorEl(null);
                            }}
                        >
                            <DeleteIcon />
                            <Typography className={classes.actionLabels}>{translations.delete}</Typography>
                        </IconButton>
                    </Grid>
                </Grid>
            </Popover>
        </Fragment>
    );
};

export default withStyles(styles)(MoreActionsPopover);
