// @flow

import React from 'react';
import { useTranslation } from 'crm-hooks/useTranslation';
import { withStyles } from '@material-ui/core/styles';

import { Grid, Typography } from '@material-ui/core';

import { CRM_DATETIME_FORMAT_DOTS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import { printName } from 'crm-utils/printName';
import type { Comment } from 'crm-types/resumeRequests';
import type { Person } from 'crm-types/allResumeRequests';

import MoreActionsPopover from 'crm-components/common/MoreActionsPopOver/MoreActionsPopover';
import UserInformationPopover from 'crm-components/common/UserInformationPopover/UserInformationPopover';

import styles from './CommentsCardDesktopStyles';

type Props = {
    classes: Object,
    commentCurrent: Comment,
    onCommentEdit: (commendId: number) => void,
    onCommentDelete: (commentId: number) => void,
    userId: number,
    reloadComments: (updatedUser: Person) => void,
};

const CommentsCardDesktop = ({
    classes,
    commentCurrent,
    onCommentEdit,
    onCommentDelete,
    userId,
    reloadComments,
}: Props) => {
    const translations = {
        edited: useTranslation('common.edited'),
    };

    const {
        id,
        description,
        employee,
        created,
        isEdited,
    } = commentCurrent;

    return (
        <Grid
            className={classes.container}
            container
            direction='row'
        >
            <Grid item xs={6}>
                {employee.id && <UserInformationPopover
                    userName={printName(employee)}
                    userNameStyle={classes.userName}
                    userId={employee.id}
                    reloadParent={reloadComments}
                />}
            </Grid>
            <Grid
                item
                xs={6}
                container
                justify='flex-end'
            >
                {
                    isEdited
                    && <Typography
                        color='textSecondary'
                        className={classes.edited}
                    >
                        {translations.edited}
                    </Typography>
                }
                <Typography className={classes.dateTime}>
                    {created ? getDate(created, CRM_DATETIME_FORMAT_DOTS) : ''}
                </Typography>
                {employee.id === userId && <MoreActionsPopover
                    commentId={id}
                    onCommentEdit={onCommentEdit}
                    onCommentDelete={onCommentDelete}
                />}
            </Grid>
            <Grid
                className={classes.descriptionContainer}
                item
                xs={12}
                container
                direction='row'
                wrap='nowrap'
                justify='space-between'
            >
                <Grid item xs={11}>
                    <Typography className={classes.description}>{description}</Typography>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(CommentsCardDesktop);
