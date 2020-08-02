// @flow

import React, { memo, type Node } from 'react';

import CRMLabeledField, {
    type CRMLabeledFieldProps,
} from 'crm-ui/CRMLabeledField/CRMLabeledField';

export type CRMEditabeleLabledFieldProps = {
    isEdit: boolean,
    renderEditable: () => Node,
    renderStatic: () => Node,
    onSave?: () => void,
    onEditCancel?: () => void,
} & $Rest<CRMLabeledFieldProps, {| children: * |}>;

const CRMEditabeleLabledField = ({
    isEdit,
    children,
    renderEditable,
    renderStatic,
    ...labeledFieldProps
}: CRMEditabeleLabledFieldProps) => (
    <CRMLabeledField {...labeledFieldProps}>
        {isEdit ? renderEditable() : renderStatic()}
    </CRMLabeledField>
);

export default memo < CRMEditabeleLabledFieldProps > (CRMEditabeleLabledField);
