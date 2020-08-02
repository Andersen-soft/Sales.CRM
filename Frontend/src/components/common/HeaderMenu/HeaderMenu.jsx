// @flow
import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import classnames from 'classnames';
import {
    MenuList,
    MenuItem,
    Popper,
    Paper,
    Grid,
    Grow,
    IconButton,
    Drawer,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Typography,
} from '@material-ui/core';
import type { ContextRouter } from 'react-router-dom';

import MenuIcon from '@material-ui/icons/Menu';
import { ExpandMore } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';

import { intersection, isEmpty } from 'ramda';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';
import { FormattedMessage } from 'react-intl';

import { getMenuTabsForUser, getTabSettings, getParentPage } from 'crm-helpers/navigation';
import CRMIcon from 'crm-icons';
import { NETWORK_COORDINATOR } from 'crm-roles';
import { RESUME_REQUESTS_ALL, ESTIMATION_REQUEST_ALL } from 'crm-constants/navigation/pages';
import { pages } from 'crm-constants/navigation';

import type { TabSettings } from 'crm-constants/navigation';

import { withStyles } from '@material-ui/core/styles';

import routesConfig from '../../../routes/routesConfig';

import styles from './HeaderMenuStyles';

type Props = ContextRouter & {
    userRole: Array<string>,
    classes: Object,
};

const Menu = ({ userRole, history, location, match: { path: currentPath }, classes }: Props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMenuState, setMobileMenuState] = useState(false);
    const [parentPage, setParenPage] = useState(getParentPage(location.pathname));

    const isMobile = useMobile();

    const checkForExactNC = roles => roles.length === 1 && !isEmpty(intersection([NETWORK_COORDINATOR], roles));

    const handleMenuOpen = event => setAnchorEl(event.currentTarget);

    const handleMenuClose = () => setAnchorEl(null);

    const handleOpenSubMenu = link => {
        const value = parentPage === link ? '' : link;

        setParenPage(value);
    };

    const toogleMobileMenu = () => setMobileMenuState(!mobileMenuState);

    const renderLinkMenuItem = (link, active) => {
        const { title }: TabSettings = getTabSettings(link);

        return (
            <Link
                to={link}
                className={classes.noLink}
                onClick={toogleMobileMenu}
            >
                <MenuItem
                    selected={active}
                    classes={{
                        root: classnames(classes.item, { [classes.mobileItem]: isMobile }),
                        selected: isMobile ? classes.mobileSelected : classes.selected,
                    }}
                    disableTouchRipple
                >
                    <span className={classnames(classes.title, { [classes.mobileTitle]: isMobile })}>
                        <FormattedMessage id={title} />
                    </span>
                </MenuItem>
            </Link>
        );
    };

    const renderDesctopSubMenuItems = (link, active, children) => {
        const open = Boolean(anchorEl);
        const { title }: TabSettings = getTabSettings(link);

        return (
            <MenuItem
                selected={active}
                classes={{
                    root: classnames(classes.item, classes.subItem),
                    selected: classes.selected,
                }}
                onMouseEnter={handleMenuOpen}
                onMouseLeave={handleMenuClose}
                disableTouchRipple
            >
                <span className={classnames(classes.title, classes.subTitle)}>
                    <FormattedMessage id={title} />
                </span>
                <Popper
                    className={classes.subMenu}
                    open={open}
                    anchorEl={anchorEl}
                    placement='bottom-end'
                    transition
                    disablePortal
                >
                    {({ TransitionProps }) => (
                        <Grow {...TransitionProps}>
                            <Paper
                                classes={{
                                    root: classes.subMenuRadius,
                                }}
                            >
                                <MenuList>
                                    {children.map(
                                        ({ roles, link: subLink, title: subTitle }) => !isEmpty(intersection(roles, userRole)) && (
                                            <Grid
                                                key={subLink}
                                                className={
                                                    classes.menuItemWrapper
                                                }
                                            >
                                                <Link className={classes.noLink} to={subLink}>
                                                    <MenuItem
                                                        key={subTitle}
                                                        classes={{
                                                            root: classes.subMenuItem,
                                                        }}
                                                    >
                                                        <FormattedMessage id={subTitle} />
                                                    </MenuItem>
                                                </Link>
                                            </Grid>
                                        ),
                                    )}
                                </MenuList>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </MenuItem>
        );
    };

    const renderMobileSubMenuItems = (link, children) => {
        const { title }: TabSettings = getTabSettings(link);
        const currentUrl = location.pathname;

        return (
            <MenuItem
                classes={{
                    root: classnames(classes.item, classes.mobileSubItem),
                }}
                disableTouchRipple
            >
                <ExpansionPanel
                    onChange={() => handleOpenSubMenu(link)}
                    expanded={link === parentPage}
                    classes={{
                        root: classes.expansionRoot,
                        expanded: classes.expansionExpanded,
                    }}
                >
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMore />}
                        classes={{
                            root: classes.expansionSummaryRoot,
                            content: classes.expansionSummaryContent,
                        }}
                    >
                        <FormattedMessage id={title} />
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails
                        classes={{
                            root: classes.expansionDetailsRoot,
                        }}
                    >
                        <MenuList className={classes.mobileSubList}>
                            {children.map(
                                ({ roles, link: subLink, title: subTitle }) => !isEmpty(intersection(roles, userRole)) && (
                                    <Link
                                        key={subLink}
                                        className={classes.noLink}
                                        to={subLink}
                                        onClick={toogleMobileMenu}
                                    >
                                        <MenuItem
                                            selected={subLink === currentUrl}
                                            key={subTitle}
                                            disableTouchRipple
                                            classes={{
                                                root: classes.mobileSubMenuItem,
                                                selected: classes.mobileSelected,
                                            }}
                                        >
                                            <FormattedMessage id={subTitle} />
                                        </MenuItem>
                                    </Link>
                                ),
                            )}
                        </MenuList>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </MenuItem>
        );
    };

    const renderSubMenuItem = (link, active, children) => {
        return isMobile
            ? renderMobileSubMenuItems(link, children)
            : renderDesctopSubMenuItems(link, active, children);
    };

    const checkIsActiveMenuItem = (link, children) => {
        const currentUrl = location.pathname;

        if (link === ESTIMATION_REQUEST_ALL && currentPath === `${pages.ESTIMATION_REQUESTS}/:estimationId`) {
            return true;
        }
        if (link === RESUME_REQUESTS_ALL && currentPath === `${pages.RESUME_REQUESTS}/:resumeId`) {
            return true;
        }

        return children
            ? children.map(({ link: childrenLink }) => childrenLink).includes(currentUrl)
            : link === currentUrl;
    };

    const renderTab = (link: string) => {
        const { title, children }: TabSettings = getTabSettings(link);
        const active = checkIsActiveMenuItem(link, children);

        return (
            title && (
                <Grid
                    key={link}
                    classes={{
                        root: classnames({ [classes.mobile]: isMobile }),
                    }}
                >
                    {children
                        ? renderSubMenuItem(link, active, children)
                        : renderLinkMenuItem(link, active)
                    }
                </Grid>
            )
        );
    };

    const menuLinks: Array<string> = getMenuTabsForUser(userRole);

    const renderDrawer = () => (
        <Drawer
            anchor='right'
            open={mobileMenuState}
            onClose={toogleMobileMenu}
            classes={{
                paper: classes.mobileMenu,
            }}
        >
            <Grid
                container
                direction='column'
                justify='center'
                alignItems='stretch'
            >
                <Grid
                    container
                    justify='flex-end'
                >
                    <IconButton
                        aria-label='Close'
                        onClick={toogleMobileMenu}
                    >
                        <CRMIcon IconComponent={CloseIcon} />
                    </IconButton>
                </Grid>
                <Grid item>
                    <MenuList>
                        {menuLinks.map(link => renderTab(link))}
                    </MenuList>
                </Grid>
            </Grid>
        </Drawer>
    );

    const renderDesctopMenu = () => (
        <MenuList className={classes.list}>
            {menuLinks.map(link => renderTab(link))}
        </MenuList>
    );

    const renderMobileMenu = () => {
        const config = routesConfig.find(({ path }) => path === currentPath);
        const isNetworkCoordinator = checkForExactNC(userRole);

        return !isNetworkCoordinator && (
            <Grid
                container
                justify='space-between'
                alignItems='center'
            >
                <Typography className={classes.mobilePageTitle}>
                    {config && config.title}
                </Typography>
                <IconButton
                    aria-label='Expand'
                    onClick={toogleMobileMenu}
                >
                    <CRMIcon IconComponent={MenuIcon} />
                </IconButton>
                {renderDrawer()}
            </Grid>);
    };

    return isMobile ? renderMobileMenu() : renderDesctopMenu();
};

export default withRouter(withStyles(styles)(Menu));
