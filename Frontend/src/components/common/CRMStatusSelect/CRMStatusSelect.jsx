// @flow

import React, { memo, useState } from 'react';
import { prop } from 'ramda';

import { withStyles } from '@material-ui/core/styles';
import { saleStatuses } from 'crm-constants/desktop/statuses';
import { FormattedMessage } from 'react-intl';

import CRMStatusBlock, { type CRMStatusBlockProps } from 'crm-ui/CRMStatus/CRMStatusBlock';
import CRMStatusButton from 'crm-ui/CRMStatus/CRMStatusButton';
import { Popover } from '@material-ui/core';
import type { SalesStatusType } from 'crm-constants/desktop/statuses';
import styles from './CRMStatusSelectStyles';

type CRMStatusSelectProps = {
    isEditable?: boolean
} & CRMStatusBlockProps

const CRMStatusSelect = memo(({
    selectedStatus, classes, onStatusChange, isEditable, ...blockProps
}: CRMStatusSelectProps) => {
    const [popupAnchorElement, setPopupAnchorElement] = useState(null);
    const open = Boolean(popupAnchorElement);

    const salesStatus = saleStatuses.find(({ statusKey }) => statusKey === selectedStatus);

    if (!salesStatus) {
        return null;
    }

    const handleStatusChange = (status: SalesStatusType, event: SyntheticEvent<HTMLElement>) => {
        setPopupAnchorElement(null);
        status !== selectedStatus && onStatusChange(status, event);
    };

    const handleStatusBtnClick = ({ currentTarget }: SyntheticEvent<EventTarget>) => {
        isEditable && setPopupAnchorElement(currentTarget);
    };

    return (<>
        <CRMStatusButton
            selected color={prop('color', salesStatus)}
            onClick={handleStatusBtnClick}
        >
            <FormattedMessage id={salesStatus.translateKey} />
        </CRMStatusButton>
        <Popover
            open={open}
            anchorEl={popupAnchorElement}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
            classes={{ paper: classes.popover }}
            onClose={() => setPopupAnchorElement(null)}
        >
            <CRMStatusBlock
                selectedStatus={selectedStatus}
                onStatusChange={handleStatusChange}
                {...blockProps}
            />
        </Popover>
    </>);
});

export default withStyles(styles)(CRMStatusSelect);
