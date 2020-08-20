// @flow

import React from 'react';
import { useTranslation } from 'crm-hooks/useTranslation';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import { IconButton, Tooltip } from '@material-ui/core';
import CRMIcon from 'crm-icons';

type Props = {
    values: [number, (id: number) => void, (id: number) => void];
};

const ActionCell = (({
    values: [id, editForm, deleteForm],
}: Props) => {
    const translations = {
        edit: useTranslation('common.edit'),
        delete: useTranslation('common.delete'),
    };

    return <>
        <Tooltip
            title={translations.edit}
            interactive
            placement='bottom-start'
        >
            <IconButton
                onClick={() => editForm(id)}
            >
                <CRMIcon IconComponent={Edit} />
            </IconButton>
        </Tooltip>
        <Tooltip
            title={translations.delete}
            interactive
            placement='bottom-start'
        >
            <IconButton
                onClick={() => deleteForm(id)}
            >
                <CRMIcon IconComponent={Delete} />
            </IconButton>
        </Tooltip>
    </>;
});

export default ActionCell;
