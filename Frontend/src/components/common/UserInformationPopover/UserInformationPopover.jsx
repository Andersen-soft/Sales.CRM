// @flow

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { isNil } from 'ramda';
import { InfoOutlined } from '@material-ui/icons';
import EmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import {
    Popover, Grid, Typography, Tooltip,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { getUser, changeUser } from 'crm-api/UserInfoService';
import { useTranslation } from 'crm-hooks/useTranslation';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';

import EditableTextArea from './EditableTextArea';
import EditebleField from './EditebleField';
import TelegramField from './TelegramField';
import styles from './UserInformationPopoverStyles';

type User = {
    additionalInfo: string,
    email: string,
    firstName: string,
    id: number | null,
    isActive: boolean,
    isLdapUser: boolean,
    lastName: string,
    login: string,
    phone: string,
    position: string,
    roles: Array<Object>,
    skype: string,
    telegramUsername: ?string,
    lotteryParticipantDay: boolean,
    lotteryParticipantNight: boolean,
}

type Props = {
    classes: Object,
    userId: number,
    currentUser: { id: number },
    reloadParent: (updatedUser?: User) => void,
    userName: string,
    userNameStyle?: CSSStyleSheet,
};

const initialUser: User = {
    additionalInfo: '',
    email: '',
    firstName: '',
    id: null,
    isActive: false,
    isLdapUser: false,
    lastName: '',
    login: '',
    phone: '',
    position: '',
    roles: [],
    skype: '',
    telegramUsername: '',
    lotteryParticipantDay: false,
    lotteryParticipantNight: false,
};

const UserInformationPopover = ({
    classes,
    userId,
    currentUser: { id: currentUserId },
    userName,
    userNameStyle,
    reloadParent,
}: Props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [user, setUser] = useState(initialUser);

    const translations = {
        userInfo: useTranslation('userInfo.userInfo'),
        email: useTranslation('userInfo.email'),
        login: useTranslation('userInfo.login'),
        name: useTranslation('userInfo.name'),
        surname: useTranslation('userInfo.surname'),
        roles: useTranslation('userInfo.roles'),
        skype: useTranslation('userInfo.skype'),
        position: useTranslation('userInfo.position'),
        timezone: useTranslation('userInfo.timezone'),
        status: useTranslation('userInfo.status'),
        additionalInformation: useTranslation('userInfo.additionalInformation'),
        active: useTranslation('userInfo.active'),
        notActive: useTranslation('userInfo.notActive'),
        timezoneCity: useTranslation('userInfo.timezoneCity'),
        telegramUsername: useTranslation('userInfo.telegram'),
    };

    const isMobile = useMobile();

    const handleClick = async ({ currentTarget }) => {
        if (userId) {
            const userData: User = await getUser(userId);

            setAnchorEl(currentTarget);
            setUser(userData);
        }
    };

    const handleClose = () => setAnchorEl(null);

    const handleEdit = async (key, value) => {
        user.id && await changeUser(user.id, { [key]: value });

        const updatedUser: User = { ...user, ...{ [key]: value } };

        setUser(updatedUser);

        reloadParent && reloadParent(updatedUser);
    };

    const open = Boolean(anchorEl);

    const editable = user.id === currentUserId;

    const classEditable = editable ? classes.editable : classes.container;

    return (
        <>
            {userName
                ? <Tooltip
                    title={translations.userInfo}
                    disableFocusListener
                    disableHoverListener={isMobile}
                    PopperProps={{ disablePortal: true }}
                >
                    <Typography
                        onClick={handleClick}
                        className={userNameStyle}
                    >
                        {userName}
                    </Typography>
                </Tooltip>
                : <Tooltip
                    title={translations.userInfo}
                    disableFocusListener
                    disableHoverListener={isMobile}
                >
                    <InfoOutlined
                        onClick={handleClick}
                        fontSize='small'
                        className={classes.infoIcon}
                    />
                </Tooltip>
            }
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
                classes={{ root: classes.root }}
            >
                <Grid className={classes.popoverContentWrapper}>
                    <Grid container className={classEditable}>
                        <Typography
                            className={classes.subtitle}
                        >
                            {`${translations.email}:`}
                        </Typography>
                        <Grid className={classes.valueItem}>
                            {user.email
                                ? (<Typography>{user.email}</Typography>)
                                : <EmptyBlock />
                            }
                        </Grid>
                    </Grid>
                    <Grid container className={classEditable}>
                        <Typography
                            className={classes.subtitle}
                        >
                            {`${translations.login}:`}
                        </Typography>
                        <Grid className={classes.valueItem}>
                            {user.login
                                ? <Typography>{user.login}</Typography>
                                : <EmptyBlock />
                            }
                        </Grid>
                    </Grid>
                    <Grid container className={classEditable}>
                        <Typography
                            className={classes.subtitle}
                        >
                            {`${translations.name}:`}
                        </Typography>
                        <EditebleField
                            requiredField
                            value={user.firstName}
                            editable={editable}
                            handleEdit={value => handleEdit('firstName', value)}
                        />
                    </Grid>
                    <Grid container className={classEditable}>
                        <Typography
                            className={classes.subtitle}
                        >
                            {`${translations.surname}:`}
                        </Typography>
                        <EditebleField
                            requiredField
                            value={user.lastName}
                            editable={editable}
                            handleEdit={value => handleEdit('lastName', value)}
                        />
                    </Grid>
                    <Grid container className={classEditable}>
                        <Typography
                            className={classes.subtitle}
                        >
                            {`${translations.roles}:`}
                        </Typography>
                        <Grid className={classes.valueItem}>
                            {user.roles.length
                                ? (<Typography>{user.roles.map(role => role.name).join(', ')}</Typography>)
                                : <EmptyBlock />
                            }
                        </Grid>
                    </Grid>
                    <Grid container className={classEditable}>
                        <Typography
                            className={classes.subtitle}
                        >
                            {`${translations.skype}:`}
                        </Typography>
                        <EditebleField
                            value={user.skype}
                            editable={editable}
                            handleEdit={value => handleEdit('skype', value)}
                        />
                    </Grid>
                    <Grid container className={classEditable}>
                        <Typography
                            className={classes.subtitle}
                        >
                            {`${translations.telegramUsername}:`}
                        </Typography>
                        <TelegramField
                            requiredField={user.lotteryParticipantDay || user.lotteryParticipantNight}
                            value={user.telegramUsername}
                            editable={editable}
                            handleEdit={value => handleEdit('telegramUsername', value)}
                        />
                    </Grid>
                    <Grid container className={classEditable}>
                        <Typography
                            className={classes.subtitle}
                        >
                            {`${translations.position}:`}
                        </Typography>
                        <EditebleField
                            value={user.position}
                            editable={editable}
                            handleEdit={value => handleEdit('position', value)}
                        />
                    </Grid>
                    <Grid container className={classEditable}>
                        <Typography
                            className={classes.subtitle}
                        >
                            {`${translations.timezone}:`}
                        </Typography>
                        <Grid className={classes.valueItem}>
                            <Typography>UTC+3:00 ({translations.timezoneCity})</Typography>
                        </Grid>
                    </Grid>
                    <Grid container className={classEditable}>
                        <Typography
                            className={classes.subtitle}
                        >
                            {`${translations.status}:`}
                        </Typography>
                        <Grid className={classes.valueItem}>
                            {!isNil(user.isActive)
                                ? (<Typography>{user.isActive ? translations.active : translations.notActive}</Typography>)
                                : <EmptyBlock />
                            }
                        </Grid>
                    </Grid>
                    <Grid container className={classes.additionalInfo}>
                        <Typography
                            className={classes.subtitle}
                        >
                            {`${translations.additionalInformation}:`}
                        </Typography>
                        <EditableTextArea
                            fullWidth
                            value={user.additionalInfo}
                            editable={editable}
                            handleEdit={value => handleEdit('additionalInfo', value)}
                        />
                    </Grid>
                </Grid>
            </Popover>
        </>
    );
};

export default connect(
    state => ({ currentUser: state.session.userData }),
    null
)(withStyles(styles)(UserInformationPopover));
