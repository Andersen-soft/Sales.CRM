// @flow

import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, IconButton, Popover, FormHelperText } from '@material-ui/core';
import CRMIcon from 'crm-ui/CRMIcons/CRMIcon';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import PhoneIcon from 'crm-static/customIcons/phone.svg';
import EmailIcon from 'crm-static/customIcons/mail.svg';
import SocialIcon from 'crm-static/customIcons/social.svg';
import MeetingIcon from 'crm-static/customIcons/meeting.svg';
import InterviewIcon from 'crm-static/customIcons/interview.svg';
import {
    EMAIL_ACTIVITY,
    INTERVIEW_ACTIVITY,
    PHONE_ACTIVITY,
    SOCIAL_ACTIVITY,
    MEETING_ACTIVITY,
} from 'crm-constants/NewActivityDateAdding/NewActivityDateAdding';
import CRMCheckboxesGroup from 'crm-components/common/CRMCheckboxesGroup/CRMCheckboxesGroup';

import type { StyledComponentProps } from '@material-ui/core/es';
import { useTranslation } from 'crm-hooks/useTranslation';
import type { ActivityType } from 'crm-components/SalePage/activitiesHistoryTable/ActivitiesHistoryTable';

import styles from './cellsStyles';

type Props = {
    values: [Array<ActivityType>, Array<ActivityType>],
    isEdit: boolean,
    updateEditRowState: () => void,
} & StyledComponentProps;


const ActivityTypeCell = ({
    values: [types, allTypesList],
    isEdit,
    updateEditRowState,
    classes,
}: Props) => {
    const activityTypeToIcon = {
        [EMAIL_ACTIVITY]: EmailIcon,
        [INTERVIEW_ACTIVITY]: InterviewIcon,
        [PHONE_ACTIVITY]: PhoneIcon,
        [SOCIAL_ACTIVITY]: SocialIcon,
        [MEETING_ACTIVITY]: MeetingIcon,
    };

    const [localTypes, setLocalTypes] = useState(types);
    const [activityList, setActivityList] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [typesError, setTypesError] = useState(null);

    const translations = {
        errorRequiredField: useTranslation('forms.errorRequiredField'),
    };

    const isChecked = typeCode => localTypes.find(({ typeEnumCode }) => typeEnumCode === typeCode);

    const prepareList = rawData => rawData.map(({ type, typeEnumCode }) => ({
        label: type,
        value: typeEnumCode,
        checked: !!isChecked(typeEnumCode),
    }));

    useEffect(() => {
        setLocalTypes(types);
    }, [types]);

    useEffect(() => {
        if (!isEdit) {
            setLocalTypes(types);
            setTypesError(null);
        }
    }, [isEdit]);

    const handleClick = ({ currentTarget }) => {
        setAnchorEl(currentTarget);
        setActivityList(() => prepareList(allTypesList));
    };

    const handleClose = () => {
        setAnchorEl(null);

        if (localTypes.length) {
            setTypesError(null);
            updateEditRowState('types', localTypes);
        } else {
            setTypesError(translations.errorRequiredField);
            updateEditRowState('types', Error(translations.errorRequiredField));
        }
    };

    const onChangeActivityList = ({ value, label }, checked) => {
        let viewList = [];

        if (checked) {
            viewList = [...localTypes, { type: label, typeEnumCode: value }];
        } else {
            viewList = localTypes.filter(({ typeEnumCode }) => typeEnumCode !== value);
        }

        setLocalTypes(viewList);
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
                {localTypes.map(({ type, typeEnumCode }) => (
                    <Grid
                        container
                        key={typeEnumCode}
                        className={classes.activityType}
                    >
                        <CRMIcon
                            IconComponent={activityTypeToIcon[typeEnumCode]}
                            classes={{ icon: classes.icon }}
                        />
                        {type}
                    </Grid>
                ))}
                {typesError && <FormHelperText>{typesError}</FormHelperText>}
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
                                labeledCheckboxes={activityList}
                                onChange={onChangeActivityList}
                            />
                        </Popover>
                    </>}
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(ActivityTypeCell);
