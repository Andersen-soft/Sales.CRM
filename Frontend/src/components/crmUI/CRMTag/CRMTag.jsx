// @flow

import React from 'react';
import cn from 'classnames';

import { Chip, Avatar } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import CRMTagStyles from './CRMTagStyles';


type Props = {
    label: String,
    item?: Boolean,
    icon?: React$Element<any>,
    iconHandler?: Function,
    deleteIcon?: React$Element<any>,
    onDelete?: Function,
    onclick?: Function,
    classes: Object,
};


const CRMTag = ({
    label,
    item,
    icon,
    iconHandler,
    deleteIcon,
    onDelete,
    onclick,
    classes,
    ...rest
}: Props) => (
    <Chip
        onMouseDown={e => e.preventDefault()}
        className={cn(
            classes.tag,
            { [classes.listTag]: Boolean(item) },
            { [classes.pointer]: Boolean(onclick) }
        )}
        classes={{ label: cn({ [classes.label]: Boolean(icon) }) }}
        avatar={icon && <Avatar
            onClick={iconHandler}
            className={cn(classes.avatar, { [classes.pointer]: Boolean(iconHandler) })}
        >
            {icon}
        </Avatar>}
        deleteIcon={deleteIcon || <Close className={classes.deleteIcon} />}
        onDelete={onDelete}
        label={label}
        {...rest}
    />
);


export default withStyles(CRMTagStyles)(CRMTag);
