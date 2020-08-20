// @flow

import React from 'react';
import { FormControl } from '@material-ui/core';
import { pathOr, path } from 'ramda';
import { isArchiveStatus } from 'crm-utils/dataTransformers/sales/isSaleArchived';
import CRMTextArea from 'crm-ui/CRMTextArea/CRMTextArea';

import { useTranslation } from 'crm-hooks/useTranslation';
import type { AttributeProps } from './AttributeProps.flow';

const CompanyComment = ({
    classes,
    company,
    status,
    disabled,
    editComment,
    updateCompanyCard,
}: AttributeProps) => {
    const translations = {
        comment: useTranslation('sale.companySection.comment'),
    };

    const handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
        const value = path(['target', 'value'], event);

        editComment(value);
    };

    const handleBlur = () => {
        updateCompanyCard(company.id, {
            id: company.id,
            description: company.description,
            name: company.name,
            phone: company.phone,
            url: company.url,
            responsibleRmId: company.responsibleRm.id,
            industryCreateRequestList: company.industryDtos.map(({ id }) => ({ id })),
        });
    };

    const { description } = company;

    return (
        <FormControl className={classes.formControl}>
            <CRMTextArea
                multiline
                value={pathOr('', company, description)}
                rows={7}
                rowsMax={7}
                className={classes.textAreaWrapper}
                onBlur={handleBlur}
                onChange={handleChange}
                label={translations.comment}
                variant='outlined'
                InputProps={{
                    classes: {
                        input: classes.textAreaInput,
                    },
                }}
                disabled={isArchiveStatus(status) || disabled}
            />
        </FormControl>
    );
};

export default CompanyComment;
