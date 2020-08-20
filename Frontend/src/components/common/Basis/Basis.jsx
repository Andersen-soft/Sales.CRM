// @flow

import React, { useEffect } from 'react';
import type { Node } from 'react';
import cn from 'classnames';
import { AppBar, Toolbar, Grid } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import HeaderMenu from 'crm-components/common/HeaderMenu';
import HeaderControls from 'crm-components/common/HeaderControls';
import refreshToken from 'crm-helpers/api/refreshToken';
import RefreshTokenSingleton from 'crm-helpers/api/RefreshTokenSingleton';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';
import FooterMobile from 'crm-components/crmMobile/FooterMobile';
import EventEmitter from 'crm-helpers/eventEmitter';

import type { Location } from 'crm-types/location';

import LogoSVG from 'crm-static/logo.svg';
import styles from './BasisStyles';

type Props = {
    children: Node,
    userRole: Array<string>,
    userId: number,
    classes: Object,
    location: Location,
};

const Basis = ({
    children,
    userRole,
    classes,
}: Props) => {
    useEffect(() => {
        if (!RefreshTokenSingleton.getIntervalStarted()) {
            RefreshTokenSingleton.setIntervalStarted();
            refreshToken();
            RefreshTokenSingleton.setInterval(
                setInterval(() => {
                    EventEmitter.emit('refreshToken');
                    refreshToken()
                        .then(() => EventEmitter.emit('refreshTokenSuссsess'));
                }, 60000 * 20)
            );
        }
    }, []);

    const isMobile = useMobile();

    return (
        <div className={classes.container}>
            <AppBar
                position='relative'
                color='inherit'
                className={cn({ [classes.mobileAppBar]: isMobile })}
                classes={{ root: classes.root }}
            >
                <Toolbar className={classes.wrapper}>
                    <LogoSVG className={classes.icon} alt='logo' />
                    <HeaderMenu userRole={userRole} />
                    {
                        !isMobile && <Grid
                            container
                            justify='flex-end'
                            alignItems='center'
                        >
                            <HeaderControls userRole={userRole} />
                        </Grid>
                    }
                </Toolbar>
            </AppBar>
            <div className={!isMobile ? classes.content : classes.mobileContent}>
                {children}
            </div>
            {isMobile && <FooterMobile userRole={userRole} />}
        </div>
    );
};

export default withStyles(styles)(Basis);
