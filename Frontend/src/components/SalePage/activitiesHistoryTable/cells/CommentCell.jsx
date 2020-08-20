// @flow

import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { Grid, Typography, FormHelperText } from '@material-ui/core';
import CRMTextArea from 'crm-ui/CRMTextArea/CRMTextArea';
import { useTranslation } from 'crm-hooks/useTranslation';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './cellsStyles';

type Props = {
    values: string,
    isEdit: boolean,
    updateEditRowState: () => void,
} & StyledComponentProps;

export const COMMENT_MAX_HEIGHT = 104;

const CommentCell = ({
    values: comment,
    isEdit,
    updateEditRowState,
    classes,
}: Props) => {
    const [localComment, setLocalComment] = useState(comment);
    const [commentError, setCommentError] = useState(null);
    const [normalCommentHeight, setNormalCommentHeight] = useState(true);
    const [showFullComment, setShowFullComment] = useState(false);

    const commentContainer: {current: Object} = useRef(null);

    const translations = {
        comment: useTranslation('common.comment'),
        hide: useTranslation('sale.workLogSection.hide'),
        showMore: useTranslation('sale.workLogSection.showMore'),
        errorRequiredField: useTranslation('forms.errorRequiredField'),
    };

    useEffect(() => {
        if (isEdit) {
            setLocalComment(comment);
            setCommentError(null);
            setShowFullComment(true);
        }
    }, [isEdit]);

    useEffect(() => {
        commentContainer.current && (commentContainer.current.clientHeight > COMMENT_MAX_HEIGHT)
            ? setNormalCommentHeight(false)
            : setNormalCommentHeight(true);
    }, [comment]);

    const changeComment = ({
        target: { value },
    }: SyntheticInputEvent<HTMLInputElement>) => setLocalComment(value);

    const onBlurComment = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        if (!value.trim().length) {
            setCommentError(translations.errorRequiredField);
            updateEditRowState('description', Error(translations.errorRequiredField));
        } else {
            setCommentError(null);
            updateEditRowState('description', value.trim());
        }
    };

    const toogleShowFullComment = () => setShowFullComment(!showFullComment);

    const renderEditMode = () => (<Grid
        item
        className={cn(classes.cell)}
        container
        direction='column'
    >
        <CRMTextArea
            fullWidth
            multiline
            InputLabelProps={{ shrink: true }}
            value={localComment}
            rowsMax={null}
            className={classes.commentEdit}
            onBlur={onBlurComment}
            onChange={changeComment}
            variant='outlined'
            InputProps={{
                classes: {
                    input: classes.textAreaInput,
                },
            }}
        />
        {commentError && <FormHelperText>{commentError}</FormHelperText>}
    </Grid>);

    const renderValue = () => (
        <>
            <Grid
                item
                className={normalCommentHeight || showFullComment ? classes.fullCommentCell : classes.smallCell}
                ref={commentContainer}
            >
                {comment}
            </Grid>
            {
                !normalCommentHeight && <Typography
                    className={classes.showLabel}
                    onClick={toogleShowFullComment}
                >
                    {showFullComment ? translations.hide : translations.showMore}
                    <ArrowDropDown className={cn(classes.dropDownIcon, { [classes.closeIcon]: showFullComment })} />
                </Typography>
            }
        </>
    );

    return (
        <Grid
            container
            direction='column'
        >
            {isEdit ? renderEditMode() : renderValue()}
        </Grid>
    );
};

export default withStyles(styles)(CommentCell);
