// @flow

// потому что баг еслинта
/* eslint-disable */

import React, { type ComponentType } from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import styles from './CRMIconStyles';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

type Props = {
    IconComponent: ComponentType<SvgIconProps>,
    componentClasses: Object,
    classes: Object,
    className?: string,
    fixedSize: boolean,
    children?: Node,
    noOpacity?: boolean,
    onClick?: Function,
};

const CRMIcon = ({
    componentClasses,
    classes,
    fixedSize,
    className,
    noOpacity,
    IconComponent,
    onClick,
    ...rest
}: Props) => {
    const iconClassName = cn(className, classes.icon, {
        [classes.fixedSize]: fixedSize,
        [classes.noOpacity]: !!noOpacity,
        [classes.pointer]: onClick,
    });

    return (
        <IconComponent
            className={iconClassName}
            classes={componentClasses}
            onClick={onClick}
            {...rest}
        />
    );
};

CRMIcon.defaultProps = {
    fixedSize: true,
};

export default withStyles(styles)(CRMIcon);
