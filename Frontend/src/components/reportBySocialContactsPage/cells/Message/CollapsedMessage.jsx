// @flow

import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { Grid, Typography } from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { MESSAGE_MAX_HEIGHT } from 'crm-constants/reportBySocialContactsPage/socialContactsConstants';
import { useTranslation } from 'crm-hooks/useTranslation';

type Props = {
    message: string,
    classes: Object,
    normalMessageHeight: boolean,
    setNormalMessageHeight: (boolean) => void,
}

const CollapsedMessage = ({
    message,
    classes,
    normalMessageHeight,
    setNormalMessageHeight,
}: Props) => {
    const [showFullMessage, setShowFullMessage] = useState(false);

    const messageContainer: {current: Object} = useRef(null);

    const translations = {
        hide: useTranslation('sale.workLogSection.hide'),
        showMore: useTranslation('sale.workLogSection.showMore'),
    };

    useEffect(() => {
        messageContainer.current && (messageContainer.current.clientHeight > MESSAGE_MAX_HEIGHT)
            ? setNormalMessageHeight(false)
            : setNormalMessageHeight(true);
    }, [message]);

    const toogleShowFullMessage = () => setShowFullMessage(fullMessage => !fullMessage);

    return <>
        <Grid
            item
            className={normalMessageHeight || showFullMessage ? classes.fullCommentCell : classes.smallCell}
            ref={messageContainer}
        >
            {message}
        </Grid>
        {
            !normalMessageHeight && <Typography
                className={classes.showLabel}
                onClick={toogleShowFullMessage}
            >
                {showFullMessage ? translations.hide : translations.showMore}
                <ArrowDropDown className={cn(classes.dropDownIcon, { [classes.closeIcon]: showFullMessage })} />
            </Typography>
        }
    </>;
};

export default CollapsedMessage;
