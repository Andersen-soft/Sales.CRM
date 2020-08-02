// @flow

import React from 'react';
import isSaleArchived from 'crm-utils/dataTransformers/sales/isSaleArchived';

import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { RemovableItemList } from 'crm-components/common/cardAttributeWrappers';
import type { CommonListItem } from 'crm-types/resourceDataTypes';
import type { Sale } from 'crm-types/sales';
import styles from './AttributesStyles';
import type { StyledComponentProps } from '@material-ui/core/es';


type Props = {
    sale: Sale,
    saleId: number,
    attrName: string,
    pagePath: string,
    title: string,
    listFromRequest: Array<CommonListItem>,
    updateHandler: (selectedItemId: string, saleId: number) => void,
    isNewVersion?: boolean,
    userRoles?: Array<string>,
    applyId: boolean,
    disableForHr?: boolean,
    addButtonHint: string,
} & StyledComponentProps


const ManageActivities = ({
    title,
    pagePath,
    classes,
    sale,
    isNewVersion,
    userRoles,
    applyId,
    disableForHr,
    listFromRequest,
    updateHandler,
    attrName,
    addButtonHint,
} : Props) => (
    <Grid
        item
        container
        direction='row'
        wrap='nowrap'
        justify='flex-start'
        alignItems='center'
        xs={12} sm={12}
        lg={12} xl={12}
        className={classes.listLabel}
    >
        <RemovableItemList
            sale={sale}
            title={title}
            list={sale[attrName]}
            listFromRequest={listFromRequest}
            pagePath={pagePath}
            updateHandler={updateHandler}
            addButtonHint={addButtonHint}
            isEditingDisabled={isSaleArchived(sale)}
            classes={classes}
            isNewVersion={isNewVersion}
            userRoles={userRoles}
            applyId={applyId}
            disableForHr={disableForHr}
        />
    </Grid>
);


export default withStyles(styles)(ManageActivities);
