// @flow

import React, { memo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import UserInformationPopover from 'crm-components/common/UserInformationPopover/UserInformationPopover';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './cellsStyles';

type Props = {
    values: {
        name: string,
        id: number,
        realoadParent: () => void
    },
} & StyledComponentProps;

const areEqualProps = (
    { values: { id: prevUserId } },
    { values: { id: nextUserId } }
) => prevUserId === nextUserId;


const UserCell = memo < Props > (({
    values: { name, id, reloadParent },
    classes,
}: Props) => {
    return <Grid
        container
        direction='column'
    >
        {name
            ? <UserInformationPopover
                userName={name}
                userNameStyle={classes.fullName}
                userId={id}
                reloadParent={reloadParent}
            />
            : <CRMEmptyBlock />}
    </Grid>;
}, areEqualProps); // NOSONAR

export default withStyles(styles)(UserCell);
