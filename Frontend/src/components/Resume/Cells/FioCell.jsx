// @flow

import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CRMEditableField from 'crm-ui/CRMEditableField/CRMEditableField';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { changeResume } from 'crm-api/ResumeService/resumeService';
import FireSVG from 'crm-static/customIcons/Fire.svg';
import FireActiveSVG from 'crm-static/customIcons/Fire_active.svg';
import CRMIcon from 'crm-icons';

import styles from './cellStyles';

type Props = {
    values: [string, number, boolean | null, () => void, (boolean) => void],
    classes: Object,
};

const FioCell = ({
    values: [fio, id, isUrgent, reloadTable, setLoading],
    classes,
}: Props) => {
    const [localValue, setLocalValue] = useState(fio);

    const handleChange = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        setLocalValue(value);
    };

    const handleSave = async () => {
        const newFio = localValue.trim();

        if (fio !== newFio && newFio) {
            setLoading(true);
            await changeResume({ resumeId: id, fio: newFio });
            reloadTable();
        } else {
            setLocalValue(fio);
        }
    };

    const onChangeUrgent = async () => {
        setLoading(true);
        await changeResume({ resumeId: id, isUrgent: !isUrgent });
        reloadTable();
    };

    const renderCustomLabel = () => fio
        ? <>
            <CRMIcon
                IconComponent={isUrgent ? FireActiveSVG : FireSVG}
                className={classes.fireIcon}
                onClick={onChangeUrgent}
            />
            <Typography className={classes.fio}>
                {fio}
            </Typography>
        </>
        : <CRMEmptyBlock />;

    return <CRMEditableField
        component={CRMInput}
        componentType='input'
        onCloseEditMode={handleSave}
        renderCustomLabel={renderCustomLabel}
        justify='flex-start'
        showEditOnHover
        componentProps={{
            value: localValue,
            onChange: handleChange,
            fullWidth: true,
        }}
    />;
};

export default withStyles(styles)(FioCell);
