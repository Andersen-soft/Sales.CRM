// @flow

import React, { memo } from 'react';
import cn from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import type { StyledComponentProps } from '@material-ui/core/es';
import { type SalesStatusType, saleStatuses } from 'crm-constants/desktop/statuses';
import { identity, curryN } from 'ramda';
import styles from './CRMStatusStyle';
import StatusButton from './CRMStatusButton';
import { FormattedMessage } from 'react-intl';

export type CRMStatusBlockProps = {
    selectedStatus?: SalesStatusType,
    onStatusChange?: (status:SalesStatusType, event: SyntheticEvent<HTMLElement>) => void,
} & StyledComponentProps;

const CRMStatusBlock = memo(({
    classes, className, onStatusChange = identity, selectedStatus,
}: CRMStatusBlockProps) => (
    <Grid
        container
        className={cn(classes.root, className)}
        direction='row'
        wrap='wrap'
        justify='space-between'
        alignItems='center'
        alignContent='space-between'
    >
        {saleStatuses.map(({ statusKey, color, translateKey }) => (
            <StatusButton
                key={statusKey}
                onClick={curryN(2, onStatusChange)(statusKey)}
                color={color}
                selected={selectedStatus === statusKey}
            >
                <FormattedMessage id={translateKey} />
            </StatusButton>
        ))}
    </Grid>
));


export default withStyles(styles)(CRMStatusBlock);
