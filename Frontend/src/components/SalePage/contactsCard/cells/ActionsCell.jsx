// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Link } from '@material-ui/core';
import { Close, Delete, Edit, Star } from '@material-ui/icons';
import CRMIcon from 'crm-icons';
import CRMDotMenu from 'crm-ui/CRMDotMenu/CRMDotMenu';
import CheckIcon from 'crm-static/customIcons/check.svg';
import { useTranslation } from 'crm-hooks/useTranslation';
import { getSalesWithMainContact } from 'crm-api/contactsCard/contactsCardService';
import Notification from 'crm-components/notification/NotificationSingleton';
import { pages } from 'crm-constants/navigation';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './cellsStyles';

type Props = {
    values: [
        number,
        () => void,
        ({ id: number }) => void,
        (id: number) => void,
        (id: number) => void,
        number,
    ],
    isEdit: boolean,
    updateEditRowState: () => void,
} & StyledComponentProps;

const ActionsCell = ({
    values: [
        id,
        saveContactChange,
        onEditContact,
        showConfirmationDeleteContact,
        updateMainContact,
        mainContactId,
    ],
    isEdit,
    classes,
}: Props) => {
    const translations = {
        edit: useTranslation('common.edit'),
        delete: useTranslation('common.delete'),
        canNotDeleteContact: useTranslation('sale.contactSection.canNotDeleteContact'),
        sales: useTranslation('sale.contactSection.sales'),
        sale: useTranslation('sale.contactSection.sale'),
        specified: useTranslation('sale.contactSection.specified'),
        specifieds: useTranslation('sale.contactSection.specifieds'),
        setMainContact: useTranslation('sale.contactSection.setMainContact'),

        makeMainContact: useTranslation('sale.contactSection.makeMainContact'),
    };

    const getMessage = sales => <Grid>
        <span>{`${translations.canNotDeleteContact} ${sales.length > 1 ? translations.sales : translations.sale} `}</span>
        {sales.map(({ id: saleId }, index, arr) => <Link
            key={saleId}
            href={`${pages.SALES_FUNNEL}/${saleId}`}
            className={classes.link}
            rel='noopener noreferrer'
            target='_blank'
        >
            {saleId}
            {index + 1 !== arr.length ? ', ' : '. '}
        </Link>)}
        {` ${translations.setMainContact} `}
        {sales.length > 1 ? `${translations.specifieds} ${translations.sales}.` : `${translations.specified} ${translations.sale}.`}
    </Grid>;

    const checkIsMainContactInOtherSale = async () => {
        const { content } = await getSalesWithMainContact(id);

        if (content.length) {
            Notification.showMessage({
                message: getMessage(content),
                type: 'error',
                isHidenIcon: true,
                isTimerDisabled: true,
            });
        } else {
            showConfirmationDeleteContact(id);
        }
    };

    const dotMenuConfig = [
        { icon: Star, text: translations.makeMainContact, handler: () => updateMainContact(id), disabled: id === mainContactId },
        { icon: Edit, text: translations.edit, handler: () => onEditContact({ id }) },
        { icon: Delete, text: translations.delete, handler: checkIsMainContactInOtherSale },
    ];

    return <Grid
        container
        justify='center'
    >
        {isEdit
            ? <Grid
                container
                direction='column'
            >
                <CRMIcon
                    IconComponent={Close}
                    onClick={() => onEditContact({})}
                />
                <CRMIcon
                    IconComponent={CheckIcon}
                    onClick={saveContactChange}
                />
            </Grid>
            : <CRMDotMenu
                className={classes.menuButton}
                config={dotMenuConfig}
            />}
    </Grid>;
};

export default withStyles(styles)(ActionsCell);
