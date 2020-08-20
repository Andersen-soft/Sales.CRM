// @flow

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'crm-hooks/useTranslation';
import type { StyledComponentProps } from '@material-ui/core/es';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';

import ResumeNameDesktop from './ResumeNameDesktop';
import ResumeNameMobile from './ResumeNameMobile';

type Props = {
    resumeRequestName?: string,
    updateRequest: (fieldName: string, updateData: string | number) => boolean | Promise<boolean>,
} & StyledComponentProps

const ResumeName = ({
    classes,
    resumeRequestName,
    updateRequest,
}: Props) => {
    const [localResumeRequestName, setLocalResumeRequestName] = useState(null);
    const [nameError, setNameError] = useState(null);

    const translations = {
        requestName: useTranslation('requestForCv.requestSection.requestName'),
        errorMaxNumOfChars: useTranslation('forms.errorMaxNumOfChars'),
        requiredField: useTranslation('common.requiredField'),
    };

    useEffect(() => {
        if (resumeRequestName && resumeRequestName !== localResumeRequestName) {
            setLocalResumeRequestName(resumeRequestName);
        }
    }, [resumeRequestName]);

    const changeName = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        switch (true) {
            case (!value.length):
                setNameError(translations.requiredField);
                setLocalResumeRequestName(value);
                break;
            case (value.length > 100):
                setNameError(translations.errorMaxNumOfChars);
                setLocalResumeRequestName(value.substr(0, 100));
                break;
            default: {
                setNameError(null);
                setLocalResumeRequestName(value);
            }
        }
    };

    const changeEditMode = () => {
        if (!nameError && localResumeRequestName) {
            updateRequest('name', localResumeRequestName);
        } else {
            setLocalResumeRequestName(resumeRequestName);
            setNameError(null);
        }
    };

    const isMobile = useMobile();

    const SectionLayout = isMobile ? ResumeNameMobile : ResumeNameDesktop;

    return (
        <SectionLayout
            localResumeRequestName={localResumeRequestName}
            translateRequestName={translations.requestName}
            changeEditMode={changeEditMode}
            changeName={changeName}
            nameError={nameError}
        />
    );
};

export default ResumeName;
