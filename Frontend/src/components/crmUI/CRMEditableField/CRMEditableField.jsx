// @flow

import React, { useState, isValidElement, type ComponentType } from 'react';
import { pathOr } from 'ramda';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, ClickAwayListener, Tooltip } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { useTranslation } from 'crm-hooks/useTranslation';
import { FIELD_SELECT, FIELD_INPUT } from 'crm-constants/crmUI/CRMEditableField';
import CRMIcon from 'crm-ui/CRMIcons';

import styles from './CRMEditableFieldStyles';

type EditableValue = {
    label: string | number,
    value: string | number,
}

type Props = {
    classes: Object,
    onCloseEditMode?: (value?: EditableValue | null) => void,
    disableEdit: boolean,
    renderCustomLabel: () => Node | Node,
    component: ComponentType<Object>,
    componentType: string,
    justify?: string,
    showEditOnHover?: boolean,
    componentProps: {
        error?: boolean | string,
        showErrorMessage?: boolean,
        value: EditableValue,
        options: Array<EditableValue>,
        onChange: (value: EditableValue | null) => void,
        onBlur?: (value: EditableValue | null) => void,
    },
}

const CRMEditableField = ({
    classes,
    componentProps,
    componentType,
    disableEdit,
    component: EditableComponent,
    renderCustomLabel,
    onCloseEditMode,
    justify = 'flex-end',
    showEditOnHover = false,
}: Props) => {
    const [isEdit, setIsEdit] = useState(false);

    const translations = {
        emptyBlock: useTranslation('components.emptyBlock'),
        edit: useTranslation('components.tooltip.edit'),
    };

    const onChangeEditMode = newValue => {
        isEdit && onCloseEditMode && onCloseEditMode(newValue);

        setIsEdit(!isEdit);
    };

    const onChange = newValue => {
        componentProps.onChange && componentProps.onChange(newValue);

        if (componentType === FIELD_SELECT && newValue) {
            setIsEdit(!isEdit);
        }
    };

    const onBlur = newValue => {
        componentProps.onBlur && componentProps.onBlur(newValue);
        onChangeEditMode();
    };

    const renderLabel = () => {
        if (renderCustomLabel && isValidElement(renderCustomLabel)) {
            return renderCustomLabel;
        }

        if (renderCustomLabel) {
            return renderCustomLabel();
        }

        switch (componentType) {
            case FIELD_SELECT:
                return (
                    <Typography className={classes.inlineStyle}>
                        {pathOr(translations.emptyBlock, ['value', 'label'], componentProps)}
                    </Typography>
                );
            case FIELD_INPUT:
                return (
                    <Typography className={classes.inlineStyle}>
                        {pathOr(translations.emptyBlock, ['value'], componentProps)}
                    </Typography>
                );
            default:
                return translations.emptyBlock;
        }
    };

    const renderValue = () => (
        <Grid
            container
            justify={justify}
            alignItems='center'
            wrap='nowrap'
        >
            {renderLabel()}
            {!disableEdit
                && <Tooltip title={translations.edit}>
                    <Grid>
                        <CRMIcon
                            IconComponent={Edit}
                            onClick={onChangeEditMode}
                            className={cn(classes.editIcon, { [classes.hideIcon]: showEditOnHover })}
                        />
                    </Grid>
                </Tooltip>}
        </Grid>);

    const renderEditMode = () => (
        <ClickAwayListener onClickAway={onChangeEditMode}>
            <div className={classes.fullWith}>
                <EditableComponent
                    {...componentProps}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            </div>
        </ClickAwayListener>
    );

    return (
        <Grid
            container
            justify={justify}
            alignItems='center'
            className={cn({ [classes.hoverContainer]: showEditOnHover })}
        >
            {isEdit ? renderEditMode() : renderValue()}
        </Grid>
    );
};

export default withStyles(styles)(CRMEditableField);
