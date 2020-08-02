// @flow

import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Grid, IconButton, Popover, FormHelperText } from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import CRMIcon from 'crm-ui/CRMIcons/CRMIcon';
import CRMCheckboxesGroup from 'crm-components/common/CRMCheckboxesGroup/CRMCheckboxesGroup';

import type { StyledComponentProps } from '@material-ui/core/es';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './cellsStyles';

type User = {
    id: number,
    firstName: string,
    lastName: string,
}

type Props = {
    values: [Array<User>, Array<User>],
    isEdit: boolean,
    updateEditRowState: () => void,
} & StyledComponentProps;

const WithWhomCell = ({
    values: [contacts = [], allContactsList],
    isEdit,
    updateEditRowState,
    classes,
}: Props) => {
    const [userList, setUserList] = useState(contacts);
    const [checkedList, setCheckedList] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [contactsError, setContactsError] = useState(null);

    const translations = {
        errorRequiredField: useTranslation('forms.errorRequiredField'),
    };

    const isChecked = checkedId => {
        const checkedIds = userList.map(({ id }) => id);

        return checkedIds.includes(checkedId);
    };

    const prepareContacts = (contactsList: Array<User>) => contactsList.map(({
        id,
        firstName,
        lastName,
    }) => ({
        key: id,
        label: `${firstName} ${lastName}`,
        value: String(id),
        checked: isChecked(id),
    }));

    useEffect(() => {
        setUserList(contacts);
    }, [contacts]);

    useEffect(() => {
        if (!isEdit) {
            setUserList(contacts);
            setContactsError(null);
        }
    }, [isEdit]);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
        setCheckedList(prepareContacts(allContactsList));
    };

    const handleClose = () => {
        setAnchorEl(null);

        const ids = userList.map(({ id }) => id);

        if (ids.length) {
            setContactsError(null);
            updateEditRowState('contacts', ids);
        } else {
            setContactsError(translations.errorRequiredField);
            updateEditRowState('contacts', Error(translations.errorRequiredField));
        }
    };

    const onChangeUserList = ({ key, label }, checked) => {
        let viewList = [];

        if (checked) {
            viewList = [...userList, { id: Number(key), firstName: label, lastName: '' }];
        } else {
            viewList = userList.filter(({ id }) => id !== key);
        }

        setUserList(viewList);
    };

    const checkIsRemoved = currentId => {
        if (allContactsList) {
            const allContactsIds = allContactsList.map(({ id }) => id);

            return !allContactsIds.includes(currentId);
        }

        return false;
    };

    const formattedFullContactName = (firstName: string, lastName: string) => {
        let formattedName;

        if (lastName) {
            formattedName = `${firstName} ${lastName}`.trim();
        } else {
            formattedName = `${firstName}`.trim();
        }

        return formattedName;
    };

    const open = Boolean(anchorEl);

    return (
        <Grid
            className={classes.cell}
            container
            justify='space-between'
            alignItems='flex-start'
            wrap='nowrap'
        >
            <Grid item>
                { userList.map(({ id, firstName, lastName }) => (
                    <div
                        key={id}
                        className={cn(classes.fullWidth, { [classes.removed]: checkIsRemoved(id) })}
                    >
                        {formattedFullContactName(firstName, lastName)}
                    </div>))
                }
                {contactsError && <FormHelperText>{contactsError}</FormHelperText>}
            </Grid>
            <Grid item>
                {isEdit
                    && <>
                        <IconButton
                            onClick={handleClick}
                            className={classes.openListIcon}
                        >
                            <CRMIcon IconComponent={ArrowDropDown} />
                        </IconButton>
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'center',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'center',
                                horizontal: 'right',
                            }}
                            classes={{ paper: classes.listPaper }}
                        >
                            <CRMCheckboxesGroup
                                labeledCheckboxes={checkedList}
                                onChange={onChangeUserList}
                            />
                        </Popover>
                    </>}
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(WithWhomCell);
