// @flow

import React, { useState } from 'react';

import CRMIcon from 'crm-ui/CRMIcons/CRMIcon';
import CRMCheckboxesGroup from 'crm-components/common/CRMCheckboxesGroup/CRMCheckboxesGroup';
import { useTranslation } from 'crm-hooks/useTranslation';

import { withStyles } from '@material-ui/core/styles';
import {
    Grid,
    Popover,
    Tooltip,
    IconButton,
} from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import styles from './ReportSettingsStyles';

type ColumnConfig = {
    visible: boolean,
    title: string,
    key: string,
}

type Props = {
    classes: Object,
    getColumnsConfig: () => Array<ColumnConfig>,
    handleChangeColumnVisibility: (id: any) => void,
};

const DEPRECATED_KEYS = ['actions', 'id'];

const ReportSettings = ({
    classes,
    getColumnsConfig,
    handleChangeColumnVisibility,
}: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [columnsGroup, setGroupColumns] = useState([]);

    const translations = {
        reportSettings: useTranslation('socialNetworksReplies.common.reportSettings'),
    };

    const handleOpen = ({ currentTarget }: SyntheticEvent<HTMLElement>) => {
        setAnchorEl(currentTarget);
        setIsOpen(true);

        const columnsFiltered = getColumnsConfig()
            .filter(({ key }) => !DEPRECATED_KEYS.includes(key))
            .map(({ visible, title, key }) => ({
                key,
                label: title,
                value: title,
                checked: visible,
                checkboxProps: { disableRipple: true },
            }));

        setGroupColumns(columnsFiltered);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setIsOpen(false);
    };

    return (
        <Grid
            container
            justify='flex-end'
        >
            <Tooltip
                title={translations.reportSettings}
                interactive
                placement='bottom-start'
            >
                <IconButton
                    className={classes.iconButton}
                    onClick={handleOpen}
                >
                    <CRMIcon IconComponent={Settings} />
                </IconButton>
            </Tooltip>
            <Popover
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                classes={{ paper: classes.listPaper }}
            >
                <CRMCheckboxesGroup
                    labeledCheckboxes={columnsGroup}
                    onChange={({ key }) => handleChangeColumnVisibility(key)}
                />
            </Popover>
        </Grid>
    );
};

export default withStyles(styles)(ReportSettings);
