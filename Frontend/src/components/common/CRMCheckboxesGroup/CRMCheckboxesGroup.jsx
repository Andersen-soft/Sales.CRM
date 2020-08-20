// @flow

import React, { memo, useState } from 'react';
import { curry, find } from 'ramda';
import { FormGroup } from '@material-ui/core';
import { type Props as CRMCheckBoxProps } from 'crm-ui/CRMCheckbox/CRMCheckbox';
import type { StyledComponentProps } from '@material-ui/core/es';
import CRMFormControlCheckboxLabel from 'crm-ui/CRMFormControlCheckboxLabel/CRMFormControlCheckboxLabel';

export type ILabeledCheckbox = {
    key?: string | number,
    label: string,
    value: string,
    checked?: boolean,
    checkboxProps?: $Shape<CRMCheckBoxProps>,
};

type Props = {
    labeledCheckboxes: Array<ILabeledCheckbox>,
    onChange?: (element: ILabeledCheckbox, checked: boolean) => void,
    controlled?: boolean,
} & StyledComponentProps;

type CheckedChebox = {
    value: string,
    checked: boolean,
};

const initCheckedCheckboxes = (
    labeledCheckboxes: Array<ILabeledCheckbox>,
): Array<CheckedChebox> => labeledCheckboxes.map(({ value, checked = false }) => ({ value, checked }));

const findByValue = curry((value, arr) => find(({ value: cbVal }) => value === cbVal, arr));

const CRMCheckboxesGroup = ({
    labeledCheckboxes, onChange, controlled = false,
}: Props) => {
    const labeledCheckboxesWithProps = labeledCheckboxes.map(
        ({ checkboxProps = {}, ...rest }) => ({ checkboxProps, ...rest }),
    );

    const [checkedCheckboxes, setCheckedCheckboxes] = useState(
        initCheckedCheckboxes(labeledCheckboxesWithProps),
    );

    const handleChange = (
        event: SyntheticInputEvent<HTMLInputElement>,
        checked: boolean,
    ) => {
        const { target: { value } } = event;

        const checkedElement: ILabeledCheckbox = findByValue(
            value,
            labeledCheckboxes,
        );

        !controlled
                && setCheckedCheckboxes(
                    checkedCheckboxes.map(
                        ({ value: cbVal, checked: isChecked }) => ({
                            value: cbVal,
                            checked: value === cbVal ? checked : isChecked,
                        }),
                    ),
                );

        onChange && onChange(checkedElement, checked);
    };

    return (
        <FormGroup>
            {labeledCheckboxesWithProps.map(
                ({
                    key, label, value, checked, checkboxProps,
                }) => (
                    <CRMFormControlCheckboxLabel
                        key={key || value}
                        checked={
                            controlled
                                ? checked
                                : findByValue(value, checkedCheckboxes).checked
                        }
                        value={value}
                        onChange={handleChange}
                        label={label}
                        checkboxProps={checkboxProps}
                    />
                ),
            )}
        </FormGroup>
    );
};


export default memo < Props > (CRMCheckboxesGroup);
