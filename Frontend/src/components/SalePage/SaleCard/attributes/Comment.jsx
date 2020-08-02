// @flow

import React from 'react';
import { FormControl } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { pathOr } from 'ramda';
import CRMTextArea from 'crm-ui/CRMTextArea/CRMTextArea';

import type { Sale } from 'crm-types/sales';
import type { StyledComponentProps } from '@material-ui/core/es';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './AttributesStyles';

type Props = {
    sale: Sale,
    updateHandler: ({ description: string }) => void,
    editHandler: (string) => void,
    disable?: boolean,
    contactCount: number,
} & StyledComponentProps

const Comment = ({
    editHandler,
    sale,
    updateHandler,
    disable,
    classes,
    contactCount,
}: Props) => {
    const translations = {
        comment: useTranslation('common.comment'),
    };

    const handleChange = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => editHandler(value);

    const handleBlur = () => updateHandler({ description: sale.description });

    const getComentRowsRelationOnContactCount = () => {
        switch (true) {
            case (contactCount === 2):
                return 6;
            case (contactCount >= 3):
                return 11;
            default: return 2;
        }
    };

    return (
        <FormControl className={classes.formControl}>
            <CRMTextArea
                fullWidth
                value={pathOr('', ['description'], sale)}
                label={translations.comment}
                InputProps={{
                    classes: { input: classes.commentInput },
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                className={classes.commentField}
                disabled={disable}
                rows={getComentRowsRelationOnContactCount()}
                rowsMax={getComentRowsRelationOnContactCount()}
            />
        </FormControl>
    );
};

export default withStyles(styles)(Comment);
