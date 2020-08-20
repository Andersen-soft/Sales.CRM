// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import LinksBlock from 'crm-components/desktop/LinksBlock/LinksBlock';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from '../SearchStyles';

type Props = {
    values: ?Array<number>,
} & StyledComponentProps;

const SalesCell = ({
    classes,
    values: links,
}: Props) => {
    const prepareLinks = (sales: Array<number>) => sales.map(saleId => ({
        name: `${saleId}`,
        to: `/sales/${saleId}`,
        highlighted: false,
    }));

    return links.length
        ? <LinksBlock
            justify='flex-start'
            separator=','
            closingSeparator={false}
            links={prepareLinks(links)}
            classes={{ linkRight: classes.link }}
        />
        : <CRMEmptyBlock />;
};

export default withStyles(styles)(SalesCell);
