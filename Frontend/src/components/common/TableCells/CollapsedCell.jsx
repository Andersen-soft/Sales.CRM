// @flow

import React, { useState, useRef, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import { Grid, Typography } from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { useTranslation } from 'crm-hooks/useTranslation';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './cellsStyles';

type Props = {
    values: ?string,
} & StyledComponentProps;

export const CELL_MAX_HEIGHT = 42;

const CollapsedCell = ({
    values: comment,
    classes,
}: Props) => {
    const [normalHeight, setNormalHeight] = useState(true);
    const [showFullMessage, setShowFullMessage] = useState(false);

    const messageContainer: {current: Object} = useRef(null);

    const translations = {
        hide: useTranslation('globalSearch.hide'),
        showMore: useTranslation('globalSearch.showMore'),
    };

    useEffect(() => {
        messageContainer.current && (messageContainer.current.clientHeight > CELL_MAX_HEIGHT)
            ? setNormalHeight(false)
            : setNormalHeight(true);
    }, [comment]);

    return comment
        ? <>
            <Grid
                item
                className={normalHeight || showFullMessage ? classes.fullCommentCell : classes.smallCell}
                ref={messageContainer}
            >
                {comment}
            </Grid>
            {
                !normalHeight && <Typography
                    className={classes.showLabel}
                    onClick={() => setShowFullMessage(fullMessage => !fullMessage)}
                >
                    {showFullMessage ? translations.hide : translations.showMore}
                    <ArrowDropDown className={cn(classes.dropDownIcon, { [classes.closeIcon]: showFullMessage })} />
                </Typography>
            }
        </>
        : <CRMEmptyBlock />;
};

export default withStyles(styles)(CollapsedCell);
