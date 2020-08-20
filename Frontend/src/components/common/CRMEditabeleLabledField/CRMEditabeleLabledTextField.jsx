// @flow

import React, {
    useCallback,
    useState,
    useEffect,
    type Node,
    type ElementRef,
    useMemo,
} from 'react';
import CRMInput, { type CRMInputProps } from 'crm-ui/CRMInput/CRMInput';
import { Typography } from '@material-ui/core';
import { type CRMLabeledFieldProps } from 'crm-ui/CRMLabeledField/CRMLabeledField';
import TextField from '@material-ui/core/TextField';
import CRMEditabeleLabledField from './CRMEditabeleLabledField';
import EmptyBlock from '../../../utils/EmptyBlock';

type CRMEditableLabeledTextFieldProps = {
    isEdit: boolean,
    inputProps: CRMInputProps,
    value: string,
    onChange?: (value: string) => void,
    renderText?: (value: string) => Node,
    inputRef?: ElementRef<TextField>
} & CRMLabeledFieldProps;

const CRMEditabeleLabledTextField = ({
    inputProps,
    children,
    value,
    onChange,
    renderText,
    inputRef,
    ...labeledFieldProps
}: CRMEditableLabeledTextFieldProps) => {
    const [inputValue, setInputValue] = useState(value);
    // shitty controlled and uncontrolled mix

    useEffect(() => setInputValue(value), [value]);

    const handleInputChange = ({
        target: { value: newVal },
    }: SyntheticInputEvent<HTMLInputElement>) => {
        setInputValue(newVal);
        onChange && onChange(newVal);
    };

    const renderEditable = useCallback(
        () => (
            <CRMInput
                inputRef={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                fullWidth
                InputProps={{ fullWidth: true, classes: {} }}
                {...inputProps}
            />
        ),
        [inputValue, inputProps, inputRef],
    );

    const renderStatic = useMemo(
        () => (renderText
            ? () => renderText(value)
            : () => (value ? <Typography>{value}</Typography> : <EmptyBlock />)),
        [renderText, value],
    );

    return (
        <CRMEditabeleLabledField
            renderEditable={renderEditable}
            renderStatic={renderStatic}
            {...labeledFieldProps}
        />
    );
};

export default CRMEditabeleLabledTextField;
