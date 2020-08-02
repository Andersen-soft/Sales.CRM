// @flow

import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { intersection, isEmpty } from 'ramda';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Grow from '@material-ui/core/Grow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Grid from '@material-ui/core/Grid';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import Add from '@material-ui/icons/Add';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { HEAD_SALES, SALES, NETWORK_COORDINATOR, MANAGER, RM } from 'crm-constants/roles';
import AddResumeRequest from 'crm-components/common/HeaderControls/AddResumeRequest';
import AddEstimationRequest from 'crm-components/common/HeaderControls/AddEstimationRequest';
import AddSaleModal from 'crm-components/AddSaleModal';
import CRMIcon from 'crm-icons';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';
import { pages } from 'crm-constants/navigation';
import { useTranslation } from 'crm-hooks/useTranslation';

import type { PopperPlacementType } from '@material-ui/core/Popper';

import styles from './HeaderControlsStyles';

type Props = {
    userRole: Array<string>,
    classes: Object,
}

type ContentProps = {
    TransitionProps: Object,
    placement: PopperPlacementType,
}

const PlusMenu = ({ userRole, classes }: Props) => {
    const [menuState, setMenuState] = useState(false);
    const [addResumeRequestModalState, setAddResumeRequestModalState] = useState(false);
    const [addEstimationRequestModalState, setAddEstimationRequestModalState] = useState(false);
    const [addSaleModalState, setAddSaleModalState] = useState(false);
    const plusButton: {current: Object} = useRef(null);
    const isMobile = useMobile();

    const translations = {
        addRequestForCv: useTranslation('header.add.addRequestForCv'),
        addRequestForEstimation: useTranslation('header.add.addRequestForEstimation'),
        addSale: useTranslation('header.add.addSale'),
        addSocialMediaReply: useTranslation('header.add.addSocialMediaReply'),
    };

    const handleMenuClose = () => setMenuState(false);
    const toogleMenu = () => setMenuState(!menuState);

    const toggleAddResumeRequest = () => {
        setAddResumeRequestModalState(!addResumeRequestModalState);
        setAddEstimationRequestModalState(false);
        setAddSaleModalState(false);
    };

    const toggleAddEstimationRequest = () => {
        setAddEstimationRequestModalState(!addEstimationRequestModalState);
        setAddResumeRequestModalState(false);
        setAddSaleModalState(false);
    };

    const toggleAddSale = () => {
        setAddSaleModalState(!addSaleModalState);
        setAddEstimationRequestModalState(false);
        setAddResumeRequestModalState(false);
    };

    const createMenu = (RequestForResume, AddRequest, AddSale, AddSocial) => {
        const menu = [];

        if (!isEmpty(intersection([HEAD_SALES, SALES], userRole))) {
            menu.push(RequestForResume, AddRequest, AddSale);
        } else if (!isEmpty(intersection([MANAGER, RM], userRole))) {
            menu.push(RequestForResume, AddRequest);
        }

        if (!isEmpty(intersection([NETWORK_COORDINATOR], userRole))) {
            menu.push(AddSocial);
        }

        return menu;
    };

    const renderMenu = () => {
        const RequestForResume = (
            <Grid key='resume'>
                <MenuItem
                    onClick={toggleAddResumeRequest}
                    classes={{ root: classes.popupMenuItem }}
                >
                    {isMobile
                        ? <Typography className={classes.mobileSubMenuItem}>
                            <CRMIcon IconComponent={Add} />
                            <span className={classes.popupMenuText}>
                                {translations.addRequestForCv}
                            </span>
                        </Typography>
                        : translations.addRequestForCv}
                </MenuItem>
            </Grid>
        );

        const AddRequest = (
            <Grid key='estimation'>
                <MenuItem
                    onClick={toggleAddEstimationRequest}
                    classes={{ root: classes.popupMenuItem }}
                >
                    {isMobile
                        ? <Typography className={classes.mobileSubMenuItem}>
                            <CRMIcon IconComponent={Add} />
                            <span className={classes.popupMenuText}>
                                {translations.addRequestForEstimation}
                            </span>
                        </Typography>
                        : translations.addRequestForEstimation}
                </MenuItem>
            </Grid>
        );

        const AddSaleLink = (
            <Grid key='sale' className={classes.link}>
                <MenuItem
                    key='sale'
                    onClick={toggleAddSale}
                    classes={{ root: classes.popupMenuItem }}
                >
                    {isMobile
                        ? <Typography className={classes.mobileSubMenuItem}>
                            <CRMIcon IconComponent={Add} />
                            <span className={classes.popupMenuText}>
                                {translations.addSale}
                            </span>
                        </Typography>
                        : translations.addSale}
                </MenuItem>
            </Grid>
        );

        const AddSocial = (
            <Link
                to={`${pages.SOCIAL_ANSWER_FORM}`}
                key='social_answer_form'
                className={classes.link}
            >
                <MenuItem
                    key='social_answer_form'
                    classes={{ root: classes.popupMenuItem }}
                >
                    {isMobile
                        ? <Typography className={classes.mobileSubMenuItem}>
                            <CRMIcon IconComponent={Add} />
                            <span className={classes.popupMenuText}>
                                {translations.addSocialMediaReply}
                            </span>
                        </Typography>
                        : translations.addSocialMediaReply}
                </MenuItem>
            </Link>
        );

        return createMenu(RequestForResume, AddRequest, AddSaleLink, AddSocial);
    };

    return (
        <>
            <ClickAwayListener onClickAway={handleMenuClose}>
                <Grid
                    onMouseEnter={isMobile ? () => {} : toogleMenu}
                    onMouseLeave={isMobile ? () => {} : handleMenuClose}
                >
                    <IconButton
                        buttonRef={plusButton}
                        onClick={isMobile ? toogleMenu : () => {}}
                        className={isMobile ? classes.mobileIconButton : classes.iconButton}
                        disableTouchRipple
                    >
                        <CRMIcon IconComponent={AddCircleOutline} />
                    </IconButton>
                    <Popper
                        open={menuState}
                        placement='bottom-end'
                        anchorEl={plusButton.current}
                        className={classes.menuWrapper}
                        transition
                        disablePortal
                        modifiers={{ offset: { offset: '8px, 0px' } }}
                        onClick={isMobile ? toogleMenu : () => {}}
                    >
                        {({ TransitionProps }: ContentProps) => (
                            <Grow {...TransitionProps}>
                                <Paper classes={{ root: classes.subMenuRadius }}>
                                    <MenuList>
                                        { renderMenu() }
                                    </MenuList>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Grid>
            </ClickAwayListener>
            {addResumeRequestModalState && <AddResumeRequest
                open={addResumeRequestModalState}
                onClose={toggleAddResumeRequest}
            />}
            {addEstimationRequestModalState && <AddEstimationRequest
                open={addEstimationRequestModalState}
                onClose={toggleAddEstimationRequest}
            />}
            {addSaleModalState && <AddSaleModal
                open={addSaleModalState}
                onClose={toggleAddSale}
            />}
        </>
    );
};

export default withStyles(styles)(PlusMenu);
