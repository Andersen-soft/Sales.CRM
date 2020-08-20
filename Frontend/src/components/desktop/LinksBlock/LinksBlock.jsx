// @flow

import React from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import CRMLink from 'crm-ui/CRMLink/CRMLink';
import { StyledComponentProps } from '@material-ui/core/es';
import { GridJustification } from '@material-ui/core/Grid';

import styles from './LinksBlockStyles';

export type LinkType = {
    name: string,
    to?: string,
    highlighted?: boolean,
};

type Props = {
    // pass links or one link
    links?: Array<LinkType>,
    link?: LinkType,
    separator?: string,
    closingSeparator?: boolean,
    justify?: GridJustification,
    wrap?: GridJustification,
    linksContainer?: React$Element<any>,
} & StyledComponentProps;

const LinksBlock = ({
    classes,
    links,
    link,
    justify = 'flex-end',
    wrap = 'wrap',
    separator = ';',
    closingSeparator = true,
}: Props) => (
    <Grid
        container direction='row'
        justify={justify}
        alignItems='center'
        wrap={wrap}
        className={classes.links}
    >
        {link && <CRMLink to={link.to}>{link.name}</CRMLink>}
        {
            links.map(({ name, to, highlighted }, index, arr) => (
                <Grid item key={`${name}-${to}`}>
                    {to
                        ? (<CRMLink
                            className={cn({
                                [classes.linkLeft]: justify === 'flex-end',
                                [classes.linkRight]: justify === 'flex-start',
                                [classes.highlighted]: highlighted,
                            })}
                            to={to}
                        >
                            {name}
                            {(index + 1 !== arr.length || closingSeparator) && separator}
                        </CRMLink>)
                        : (<Typography
                            variant='body2'
                            className={cn({
                                [classes.linkLeft]: justify === 'flex-end',
                                [classes.linkRight]: justify === 'flex-start',
                                [classes.highlighted]: highlighted,
                            }, classes.noLink)}
                        >
                            {name}
                            {(index + 1 !== arr.length || closingSeparator) && separator}
                        </Typography>)
                    }
                </Grid>
            ))
        }
    </Grid>
);

LinksBlock.defaultProps = {
    links: [],
    link: null,
};

export default withStyles(styles)(LinksBlock);
