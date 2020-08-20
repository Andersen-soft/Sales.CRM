// @flow

import React, { useState, useEffect, memo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import { Grid, Menu, MenuItem, IconButton } from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import MaleImg from 'crm-static/customIcons/male.svg';
import FemaleImg from 'crm-static/customIcons/female.svg';
import CRMIcon from 'crm-icons';
import { FEMALE_KEY, MALE_KEY } from 'crm-constants/gender';

import style from './GenderStyles';

type Props = {
    classes: Object,
    values: string,
    isEdit: boolean,
    updateEditRowState: (key: string, value: string) => void,
};

const GENDER_FIELD = {
    [MALE_KEY]: MaleImg,
    [FEMALE_KEY]: FemaleImg,
};

const areEqualProps = (prevProps, nextProps) => (prevProps.values === nextProps.values)
    && (prevProps.isEdit === nextProps.isEdit);

const Gender = memo < Props > (({
    classes,
    values,
    isEdit,
    updateEditRowState,
}: Props) => {
    const [localGender, setLocalGender] = useState(values);
    const [anchorEl, setAnchorEl] = React.useState(null);

    useEffect(() => {
        setLocalGender(values);
    }, [isEdit]);

    const changeGender = genderValue => () => {
        setLocalGender(genderValue);
        updateEditRowState('sex', genderValue);
        setAnchorEl(null);
    };

    return isEdit
        ? <Grid>
            <IconButton
                onClick={({ currentTarget }: SyntheticInputEvent<HTMLInputElement>) => setAnchorEl(currentTarget)}
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
                onClose={() => setAnchorEl(null)}
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
        </Grid>
        : <Grid>
            <CRMIcon
                IconComponent={GENDER_FIELD[localGender]}
                className={classes.gender}
            />
        </Grid>;
}, areEqualProps); // NOSONAR

export default withStyles(style)(Gender);
