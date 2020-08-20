// @flow

import React, { useEffect, useState, type ComponentType } from 'react';
import { IconButton, Popover, Typography, Grid } from '@material-ui/core';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles/index';
import { MoreVert } from '@material-ui/icons';
import type { StyledComponentProps } from '@material-ui/core/es';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import CRMIcon from 'crm-icons';
import EventEmitter from 'crm-helpers/eventEmitter';


import styles from './CRMDotMenuStyles';

export type ConfigType = {
    icon: ComponentType<SvgIconProps>,
    text: string,
    handler: (id: number) => void,
    disabled?: boolean,
    itemClass?: string,
}

export type Props = {
    config: Array<ConfigType>
} & StyledComponentProps

const CRMDotMenu = ({
    classes,
    className,
    config,
}: Props) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClose = () => setAnchorEl(null);

    useEffect(() => {
        EventEmitter.on('closeDotMenu', handleClose);
        return () => EventEmitter.off('closeDotMenu');
    }, []);

    const handleClick = event => setAnchorEl(event.currentTarget);

    const handleAction = handler => {
        handleClose();
        handler();
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton
                aria-label='open'
                onClick={handleClick}
                className={cn(className)}
            >
                <CRMIcon IconComponent={MoreVert} />
            </IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                classes={{
                    paper: classes.paper,
                    root: classes.root,
                }}
            >
                {config.map(({ component, icon, text, handler, itemClass, disabled }, index) => {
                    return component || (
                        <Grid
                            key={index}
                            container
                            alignItems='center'
                            className={cn(classes.menuItem, itemClass, {
                                [classes.disabled]: disabled,
                            })}
                            onClick={() => handleAction(handler)}
                        >
                            <CRMIcon
                                IconComponent={icon}
                                className={classes.icon}
                            />
                            <Typography
                                variant='body2'
                                className={classes.typography}
                            >
                                {text}
                            </Typography>
                        </Grid>
                    );
                })}
            </Popover>
        </>
    );
};

export default withStyles(styles)(CRMDotMenu);
