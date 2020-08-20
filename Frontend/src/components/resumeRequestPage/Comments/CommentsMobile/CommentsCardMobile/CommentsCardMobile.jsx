// @flow

import React from 'react';
import { useTranslation } from 'crm-hooks/useTranslation';
import { withStyles } from '@material-ui/core/styles';

import { Grid, Typography } from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';

import { CRM_DATETIME_FORMAT_DOTS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import { printName } from 'crm-utils/printName';
import type { Comment } from 'crm-types/resumeRequests';
import type { Person } from 'crm-types/allResumeRequests';

import CRMDotMenu from 'crm-ui/CRMDotMenu/CRMDotMenu';
import UserInformationPopover from 'crm-components/common/UserInformationPopover/UserInformationPopover';

import styles from './CommentsCardMobileStyles';

type Props = {
    classes: Object,
    commentCurrent: Comment,
    onCommentEdit: (commendId: number) => void,
    onCommentDelete: (commentId: number) => void,
    userId: number,
    reloadComments: (updatedUser: Person) => void,
};

const CommentsCardMobile = ({
    classes,
    commentCurrent,
    onCommentEdit,
    onCommentDelete,
    userId,
    reloadComments,
}: Props) => {
    const translations = {
        edited: useTranslation('common.edited'),
        edit: useTranslation('common.edit'),
        delete: useTranslation('common.delete'),
    };

    const {
        id,
        description,
        employee,
        created,
        isEdited,
    } = commentCurrent;

    return (
        <Grid className={classes.container}>
            <Grid container>
                <Grid item xs={7}>
                    <Typography className={classes.dateTime}>
                        {created ? getDate(created, CRM_DATETIME_FORMAT_DOTS) : ''}
                    </Typography>
                </Grid>
                <Grid
                    container
                    justify='flex-end'
                    item
                    xs={4}
                >
                    {
                        isEdited && <Typography
                            color='textSecondary'
                            className={classes.edited}
                        >
                            {translations.edited}
                        </Typography>
                    }
                </Grid>
            </Grid>
            {employee.id === userId && <CRMDotMenu
                className={classes.dotMenu}
                config={[
                    { icon: Edit, text: translations.edit, handler: () => onCommentEdit(id) },
                    { icon: Delete, text: translations.delete, handler: () => onCommentDelete(id) },
                ]}
            />}
            <Grid item>
                {employee.id && <UserInformationPopover
                    userName={printName(employee)}
                    userNameStyle={classes.userName}
                    userId={employee.id}
                    reloadParent={reloadComments}
                />}
            </Grid>
            <Grid item>
                <Typography className={classes.description}>
                    {description}
                </Typography>
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(CommentsCardMobile);
