// @flow

import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { pathOr } from 'ramda';
import { Grid } from '@material-ui/core';
import CRMEditableField from 'crm-ui/CRMEditableField/CRMEditableField';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import { useTranslation } from 'crm-hooks/useTranslation';
import { getSources } from 'crm-api/saleService';
import { SOURCE_REFERENCE_ID } from 'crm-constants/salePage/saleCardConstant';
import SelectCompanyModal from 'crm-components/SalePage/SaleCard/SelectCompanyModal';
import SourceValue from './SourceValue';

import type { Sale } from 'crm-types/sales';
import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './AttributesStyles';

type SourceSuggestion = {
    label: string,
    value: number,
}

type Props = {
    sale: Sale,
    updateHandler: ({ sourceId: number } | { recommendationId: number }) => void,
    disable: boolean,
} & StyledComponentProps

const Source = ({
    updateHandler,
    sale,
    classes,
    disable,
}: Props) => {
    const [selectValue, setSelectValue] = useState(null);
    const [sourcesSuggestions, setSourcesSuggestions] = useState([]);
    const [loadSource, setLoadSource] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [localRecommendation, setLocalRecommendation] = useState(null);

    const translations = {
        source: useTranslation('sale.contactSection.addContact.source'),
        notificationContactNoEmpty: useTranslation('sale.saleSection.notificationContactNoEmpty'),
    };

    useEffect(() => {
        (async () => {
            setLoadSource(true);
            const { content } = await getSources();
            const suggestions = content.map(({ name, id, tooltip }) => ({ label: name, value: id, title: tooltip }));

            setLoadSource(false);
            setSourcesSuggestions(suggestions);
        })();
    }, []);

    useEffect(() => {
        if (sale.source) {
            const source = {
                label: pathOr(null, ['source', 'name'], sale),
                value: pathOr(null, ['source', 'id'], sale),
            };

            setSelectValue(source);
        }
        setLocalRecommendation(sale.recommendation);
    }, [sale]);

    const handleChange = (source: SourceSuggestion) => {
        if (source) {
            updateHandler({ sourceId: source.value });
            setSelectValue(source);
        } else {
            setSelectValue(null);
        }

        if (source.value === SOURCE_REFERENCE_ID) {
            setShowModal(true);
        }
    };

    const onSaveRecommendation = async (recommendationId: number) => {
        await updateHandler({ recommendationId });
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
                {`${translations.source}:`}
            </Grid>
            <Grid className={classes.value}>
                <CRMEditableField
                    component={CRMAutocompleteSelect}
                    componentType='select'
                    disableEdit={disable}
                    renderCustomLabel={<SourceValue
                        company={localRecommendation}
                        source={selectValue}
                        disable={disable}
                    />}
                    componentProps={{
                        controlled: true,
                        value: selectValue,
                        options: sourcesSuggestions,
                        onChange: handleChange,
                        autoFocus: true,
                        menuIsOpen: true,
                        isClearable: false,
                        isLoading: loadSource,
                    }}
                />
                <SelectCompanyModal
                    isShowModal={showModal}
                    toggleShowModal={() => setShowModal(value => !value)}
                    recommendation={localRecommendation}
                    onSaveRecommendation={onSaveRecommendation}
                />
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(Source);
