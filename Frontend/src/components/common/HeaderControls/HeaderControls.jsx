// @flow

import * as React from 'react';
import { intersection, isEmpty } from 'ramda';

import {
    HEAD_SALES,
    SALES,
    RM,
    MANAGER,
    NETWORK_COORDINATOR,
} from 'crm-constants/roles';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';

import Search from './Search';
import PlusMenu from './PlusMenu';
import HamburgerMenu from './HamburgerMenu/HamburgerMenu';

import styles from './HeaderControlsStyles';

type Props = {
    userRole: Array<string>,
    classes: Object,
}

const Controls = ({
    userRole,
    classes,
}: Props) => {
    const isMobile = useMobile();

    const checkForExactNC = roles => roles.length === 1 && !isEmpty(intersection([NETWORK_COORDINATOR], roles));

    const renderIcons = () => {
        const icons = [];

        if (
            !isEmpty(intersection([HEAD_SALES, SALES, RM, MANAGER, NETWORK_COORDINATOR], userRole))
            && !checkForExactNC(userRole)
        ) {
            icons.push(<PlusMenu key='plus' userRole={userRole} />);
        }

        if (!isEmpty(intersection([HEAD_SALES, SALES, RM, MANAGER], userRole))) {
            icons.push(<Search key='search' classes={classes} />);
        }

        icons.push(<HamburgerMenu key='hamburger' userRole={userRole} />);

        return icons;
    };

    return (
        <Grid
            container
            justify={isMobile ? 'space-around' : 'flex-end'}
            className={isMobile ? classes.mobileControlsWrapper : classes.controlsWrapper}
        >
            {renderIcons()}
        </Grid>
    );
};

export default withStyles(styles)(Controls);
