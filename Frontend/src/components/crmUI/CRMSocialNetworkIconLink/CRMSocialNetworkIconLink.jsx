// @flow

import React, { type ComponentType } from 'react';
import { find, propOr } from 'ramda';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import LinkedInSVG from 'crm-static/customIcons/linledin.svg';
import ViadeoInSVG from 'crm-static/customIcons/viadeo.svg';
import XingSVG from 'crm-static/customIcons/xing.svg';
import AngelSVG from 'crm-static/customIcons/angel.svg';
import LogoSVG from 'crm-static/customIcons/andersen.svg';
import DefaultIconSVG from 'crm-static/customIcons/link_social.svg';
import CRMIcon from 'crm-icons';

import { SvgIconProps } from '@material-ui/core/SvgIcon';

import {
    LINKED_IN_REG_EXP,
    VIADEO_REG_EXP,
    XING_REG_EXP,
    ANGEL_REG_EXP,
    ANDERSEN_REG_EXP,
} from 'crm-constants/regexps';
import type { StyledComponentProps } from '@material-ui/core/es';
import styles from './CRMSocialNetworkIconLinkStyles';

type ISocialIconParseEntity = {
    regExp: RegExp,
    svgIcon: ComponentType<SvgIconProps>,
};

type Props = {
    link: string,
} & StyledComponentProps;

const SOCIAL_ICON_MAP: Array<ISocialIconParseEntity> = [
    { regExp: LINKED_IN_REG_EXP, svgIcon: LinkedInSVG },
    { regExp: VIADEO_REG_EXP, svgIcon: ViadeoInSVG },
    { regExp: XING_REG_EXP, svgIcon: XingSVG },
    { regExp: ANGEL_REG_EXP, svgIcon: AngelSVG },
    { regExp: ANDERSEN_REG_EXP, svgIcon: LogoSVG },
];

const iconWithDefault = propOr(DefaultIconSVG, 'svgIcon');

const CRMSocialNetworkIconLink = ({ link, classes, className, children }: Props) => link && (
    <a rel='noopener noreferrer' target='_blank' href={link}>
        <Grid
            container
            item
            alignItems={'center'}
        >
            <CRMIcon
                className={cn(className, classes.icon)}
                IconComponent={iconWithDefault(
                    find(({ regExp }) => regExp.test(link), SOCIAL_ICON_MAP),
                )}
            />
            {children && <Typography
                display='inline'
                className={classes.link}
                variant='body2'
            >
                {children}
            </Typography>}
        </Grid>
    </a>
);

export default withStyles(styles)(CRMSocialNetworkIconLink);
