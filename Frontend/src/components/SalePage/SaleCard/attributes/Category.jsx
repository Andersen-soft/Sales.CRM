// @flow

import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { pathOr } from 'ramda';

import getCategory from 'crm-api/saleCard/CategoryServiceForSale';
import CRMEditableField from 'crm-ui/CRMEditableField/CRMEditableField';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { useTranslation } from 'crm-hooks/useTranslation';

import type { Sale } from 'crm-types/sales';
import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './AttributesStyles';

type Suggestion = {
    label: string,
    value: string,
};

type Props = {
    sale: Sale,
    updateHandler: ({ responsibleId: number }) => void,
    disable: boolean,
} & StyledComponentProps;

const Category = ({
    sale,
    updateHandler,
    classes,
    disable,
}: Props) => {
    const [categoryList, setCategoryList] = useState([]);
    const [localCategory, setLocalCategory] = useState(null);

    const translations = {
        category: useTranslation('sale.saleSection.category'),
    };

    useEffect(() => {
        (async () => {
            const list = await getCategory();

            setCategoryList(list.map(item => ({ label: item, value: item })));
        })();
    }, []);

    useEffect(() => {
        setLocalCategory({ label: pathOr(null, ['category'], sale), value: pathOr(null, ['category'], sale) });
    }, [sale]);

    const renderCustomLabel = () => pathOr(null, ['value'], localCategory)
        ? <Typography className={classes.label}>{pathOr('', ['label'], localCategory)}</Typography>
        : <Grid className={classes.emptyBlock}>
            <CRMEmptyBlock />
        </Grid>;


    const handleChange = (selectedCategory: Suggestion | null) => {
        if (selectedCategory) {
            updateHandler({ category: selectedCategory.value })
                .then(() => setLocalCategory(selectedCategory));
        } else {
            updateHandler({ category: null })
                .then(() => setLocalCategory({ label: null, value: null }));
        }
    };

    return (
        <Grid
            item
            container
            direction='row'
            justify='space-between'
            alignItems='center'
            xs={12}
            wrap='nowrap'
        >
            <Grid className={classes.label}>
                {`${translations.category}:`}
            </Grid>
            <Grid className={classes.value}>
                <CRMEditableField
                    component={CRMAutocompleteSelect}
                    componentType='select'
                    disableEdit={disable}
                    renderCustomLabel={renderCustomLabel}
                    componentProps={{
                        controlled: true,
                        value: localCategory,
                        options: categoryList,
                        onChange: handleChange,
                        autoFocus: true,
                        menuIsOpen: true,
                        isClearable: true,
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(Category);
