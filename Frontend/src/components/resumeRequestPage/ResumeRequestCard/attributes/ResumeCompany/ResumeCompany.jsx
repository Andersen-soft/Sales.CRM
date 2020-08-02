// @flow

import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { useTranslation } from 'crm-hooks/useTranslation';
import type { StyledComponentProps } from '@material-ui/core/es';
import { getCompaniesSearch } from 'crm-api/companyCardService/companyCardService';
import { CANCELED_REQUEST } from 'crm-constants/common/constants';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';

import ResumeCompanyDesktop from './ResumeCompanyDesktop';
import ResumeCompanyMobile from './ResumeCompanyMobile';

type CompanyType = {
    id: number,
    name: string,
}

type Props = {
    company?: CompanyType,
    updateRequest: (fieldName: string, updateData: string | number) => boolean | Promise<boolean>,
    disable: boolean,
} & StyledComponentProps

const ResumeCompany = ({
    classes,
    company,
    updateRequest,
    disable,
}: Props) => {
    const [localCompany, setLocalCompany] = useState({});

    const translations = {
        company: useTranslation('requestForCv.requestSection.company'),
    };

    useEffect(() => {
        if (company && company.id !== localCompany.id) {
            setLocalCompany(company);
        }
    }, [company]);

    const handleSearch = async (searchCompanyValue: string, callback: (Array<{id: number, name: string}>) => void) => {
        const { content } = await getCompaniesSearch(searchCompanyValue, 150, CANCELED_REQUEST);

        callback(content);
    };

    const debounceHandleSearch = useCallback(debounce((
        searchCompanyValue: string,
        callback: (Array<{id: number, name: string}>) => void,
    ) => handleSearch(searchCompanyValue, callback), 300), []);

    const changeCompany = async (selectedCompany: CompanyType) => {
        if (selectedCompany) {
            await updateRequest('companyId', selectedCompany.id);
        }
    };

    const isMobile = useMobile();

    const SectionLayout = isMobile ? ResumeCompanyMobile : ResumeCompanyDesktop;

    return (
        <SectionLayout
            translateCompany={translations.company}
            localCompany={localCompany}
            disable={disable}
            debounceHandleSearch={debounceHandleSearch}
            changeCompany={changeCompany}
        />
    );
};

export default ResumeCompany;
