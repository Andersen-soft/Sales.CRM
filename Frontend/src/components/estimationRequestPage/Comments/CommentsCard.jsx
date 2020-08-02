// @flow

import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { printName } from 'crm-utils/printName';
import { CRM_DATETIME_FORMAT_DOTS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import UserInformationPopover from 'crm-components/common/UserInformationPopover/UserInformationPopover';
import MoreActionsPopover from 'crm-components/common/MoreActionsPopOver/MoreActionsPopover';
import { useTranslation } from 'crm-hooks/useTranslation';

import type { Person } from 'crm-types/allResumeRequests';
import type { Comment } from './Comments';

import styles from './CommentsStyles';

type Props = {
    classes: Object,
    reloadComments: (updatedUser?: Person) => void,
    userId: number,
    onCommentEdit: (commendId: number) => void,
    onCommentDelete: (commentId: number) => void,
} & Comment;

const CommentsCard = ({
    id,
    description,
    employee,
    createDate,
    isEdited,
    classes,
    reloadComments,
    userId,
    onCommentEdit,
    onCommentDelete,
}: Props) => {
    const translations = {
        edited: useTranslation('common.edited'),
    };

    return (
        <Grid
            className={classes.comment}
            container
            direction='row'
        >
            <Grid item xs={6}>
                {employee.id && <UserInformationPopover
                    userName={printName(employee)}
                    userNameStyle={classes.fullName}
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
                <Typography className={classes.dateOfCreate}>
                    {createDate
                        ? getDate(
                            createDate,
                            CRM_DATETIME_FORMAT_DOTS,
                        )
                        : ''}
                </Typography>

                {employee.id === userId && <MoreActionsPopover
                    commentId={id}
                    onCommentEdit={onCommentEdit}
                    onCommentDelete={onCommentDelete}
                />}
            </Grid>
            <Grid
                className={classes.descriptionBlock}
                item
                xs={12}
                container
                direction='row'
                wrap='nowrap'
                justify='space-between'
            >
                <Grid item xs={11}>
                    <Typography className={classes.descriptionText}>{description}</Typography>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(CommentsCard);
