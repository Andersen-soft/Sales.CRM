// @flow

import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { intersection, isEmpty } from 'ramda';
import {
    Popper,
    Paper,
    IconButton,
    MenuList,
    Grow,
    ClickAwayListener,
    Grid,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';
import { logout as logoutAction } from 'crm-actions/authActions';
import DeviceViewToggle from 'crm-components/common/HeaderControls/HamburgerMenu/DeviceViewToggle';
import { clearEstimationRequest as clearEstimationRequestAction } from 'crm-actions/allEstimationRequestsActions/getAllEstimationRequests';
import { clearResumeRequest as clearResumeRequestAction } from 'crm-actions/allResumeRequestsActions/getAllResumeRequests';
import IconMenu from 'crm-static/customIcons/menu_burger.svg';
import CRMIcon from 'crm-icons';
import { HEAD_SALES } from 'crm-roles';

import ExportContactsCompaniesModal from '../ExportContactsCompaniesModal';
import Translate from './Translate';
import LogOut from './LogOut';
import Export from './Export';

import type { PopperPlacementType } from '@material-ui/core/Popper';

import styles from '../HeaderControlsStyles';

type Props = {
    classes: Object,
    logout: () => void,
    clearEstimationRequest: () => void,
    clearResumeRequest: () => void,
    userRole: Array<string>,
}

type ContentProps = {
    TransitionProps: Object,
    placement: PopperPlacementType,
}

const HamburgerMenu = ({
    classes,
    userRole,
    logout,
    clearEstimationRequest,
    clearResumeRequest,
}: Props) => {
    const [menuState, setMenuState] = useState(false);
    const [modalState, setModalState] = useState(false);
    const [typeModal, setTypeModal] = useState('');

    const plusButton: {current: Object} = useRef(null);

    const isMobile = useMobile();

    const handleMenuClose = () => setMenuState(false);

    const handleOpenMenu = () => setMenuState(true);

    const handleCloseModal = () => {
        setModalState(false);
        setTypeModal('');
    };

    const toggleOpenModal = type => () => {
        setModalState(true);
        setTypeModal(type);
    };

    const renderMenu = () => {
        const icons = [];

        if (!isEmpty(intersection([HEAD_SALES], userRole))) {
            icons.push(<Export key='export' toggleOpenModal={toggleOpenModal} />);
        }

        icons.push(<Translate key='translate' />);

        icons.push(<DeviceViewToggle key='deviceViewToggle' />);

        icons.push(
            <LogOut
                key='logout'
                logout={logout}
                clearEstimationRequest={clearEstimationRequest}
                clearResumeRequest={clearResumeRequest}
            />
        );

        return icons;
    };

    return (
        <>
            <ClickAwayListener onClickAway={handleMenuClose}>
                <Grid
                    onMouseEnter={handleOpenMenu}
                    onMouseLeave={handleMenuClose}
                >
                    <IconButton
                        buttonRef={plusButton}
                        onClick={handleOpenMenu}
                        className={isMobile ? classes.mobileIconButton : classes.iconButton}
                        disableTouchRipple
                    >
                        <CRMIcon IconComponent={IconMenu} />
                    </IconButton>
                    <Popper
                        open={menuState}
                        placement='bottom-end'
                        anchorEl={plusButton.current}
                        className={classes.menuWrapper}
                        transition
                        disablePortal
                        modifiers={{ offset: { offset: '8px, 0px' } }}
                    >
                        {({ TransitionProps }: ContentProps) => (
                            <Grow {...TransitionProps}>
                                <Paper classes={{ root: classes.subMenuRadius }}>
                                    <MenuList>
                                        {renderMenu()}
                                    </MenuList>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Grid>
            </ClickAwayListener>
            {modalState && <ExportContactsCompaniesModal
                open={modalState}
                typeModal={typeModal}
                onClose={handleCloseModal}
            />}
        </>
    );
};

const mapDispatchToProps = {
    logout: logoutAction,
    clearEstimationRequest: clearEstimationRequestAction,
    clearResumeRequest: clearResumeRequestAction,
};

export default connect(null, mapDispatchToProps)(withStyles(styles)(HamburgerMenu));
