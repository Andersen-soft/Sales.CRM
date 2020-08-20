// @flow

import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Menu, MenuItem, IconButton } from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import { MALE_KEY, FEMALE_KEY } from 'crm-constants/gender';
import CRMIcon from 'crm-icons';
import MaleImg from 'crm-static/customIcons/male.svg';
import FemaleImg from 'crm-static/customIcons/female.svg';
import type { StyledComponentProps } from '@material-ui/core/es';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './cellsStyles';

type Props = {
    values: [string, string, string, number, number],
    isEdit: boolean,
    updateEditRowState: () => void,
} & StyledComponentProps;

const GENDER_FIELD = {
    [MALE_KEY]: MaleImg,
    [FEMALE_KEY]: FemaleImg,
};

const FioAndPositionCell = ({
    values: [fio, position, gender, userId, mainContactId],
    isEdit,
    updateEditRowState,
    classes,
}: Props) => {
    const [localFio, setLocalFio] = useState(fio);
    const [fioError, setFioError] = useState(null);
    const [localPosition, setLocalPosition] = useState(position);
    const [localGender, setLocalGender] = useState(gender);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const translations = {
        errorRequiredField: useTranslation('forms.errorRequiredField'),
    };

    useEffect(() => {
        if (isEdit) {
            setLocalFio(fio);
            setFioError(null);
            setLocalPosition(position);
            setLocalGender(gender);
        }
    }, [isEdit]);

    const changeFio = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        fioError && setFioError(null);
        setLocalFio(value);
    };

    const onBlurFio = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        if (!value.trim().length) {
            setFioError(translations.errorRequiredField);
            updateEditRowState('fio', [Error(translations.errorRequiredField), '']);
        } else {
            setFioError(null);

            const contactFullName = value.trim().split(' ').reverse();
            const [lastName, ...firstName] = contactFullName;

            updateEditRowState('fio', [firstName.reverse().join(' '), lastName]);
        }
    };

    const onBlurPosition = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) =>
        updateEditRowState('position', value.trim());

    const changePosition = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) =>
        setLocalPosition(value);

    const showGenderMenu = ({ currentTarget }: SyntheticInputEvent<HTMLInputElement>) => setAnchorEl(currentTarget);

    const handleClose = () => setAnchorEl(null);

    const changeGender = genderValue => () => {
        setLocalGender(genderValue);
        updateEditRowState('sex', genderValue);
        handleClose();
    };

    return (
        <Grid
            container
            direction='column'
            justify='center'
            className={cn(
                classes.fioAndPositionCell,
                {
                    [classes.mainContact]: userId === mainContactId,
                    [classes.fioAndPositionCellEdited]: isEdit && userId === mainContactId,
                })}
        >
            {
                isEdit
                    ? <>
                        <Grid
                            item
                            container
                            alignItems='center'
                            wrap='nowrap'
                            className={cn(classes.cell, classes.topCell)}
                        >
                            <IconButton
                                onClick={showGenderMenu}
                                className={classes.genderMenuButton}
                                disableRipple
                            >
                                <CRMIcon
                                    IconComponent={GENDER_FIELD[localGender]}
                                    className={cn(classes.gender, classes.genderIcon)}
                                />
                                <ArrowDropDown className={classes.dropDownIcon} />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={changeGender(MALE_KEY)}>
                                    <CRMIcon
                                        IconComponent={GENDER_FIELD[MALE_KEY]}
                                        className={classes.gender}
                                    />
                                </MenuItem>
                                <MenuItem onClick={changeGender(FEMALE_KEY)}>
                                    <CRMIcon
                                        className={classes.gender}
                                        IconComponent={GENDER_FIELD[FEMALE_KEY]}
                                    />
                                </MenuItem>
                            </Menu>
                            <CRMInput
                                value={localFio}
                                onChange={changeFio}
                                onBlur={onBlurFio}
                                error={fioError}
                                fullWidth
                            />
                        </Grid>
                        <Grid
                            item
                            className={classes.cell}
                        >
                            <CRMInput
                                value={localPosition}
                                onChange={changePosition}
                                onBlur={onBlurPosition}
                                fullWidth
                            />
                        </Grid>
                    </>
                    : <>
                        <Grid
                            item
                            container
                            alignItems='center'
                            wrap='nowrap'
                            className={cn(classes.cell, classes.topCell, classes.fioCell)}
                        >
                            <CRMIcon
                                IconComponent={GENDER_FIELD[localGender]}
                                className={classes.gender}
                            />
                            <Grid item>
                                {fio}
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            className={cn(classes.cell, classes.positionCell)}
                        >
                            {position || <CRMEmptyBlock className={classes.emptyBlock} />}
                        </Grid>
                    </>
            }

        </Grid>
    );
};

export default withStyles(styles)(FioAndPositionCell);
