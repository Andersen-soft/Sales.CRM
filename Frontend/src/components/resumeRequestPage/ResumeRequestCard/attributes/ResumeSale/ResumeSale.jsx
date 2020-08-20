// @flow

import React from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'crm-hooks/useTranslation';
import type { StyledComponentProps } from '@material-ui/core/es';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';

import ResumeSaleDesktop from './ResumeSaleDesktop';
import ResumeSaleMobile from './ResumeSaleMobile';

type Props = {
    saleId: number,
} & StyledComponentProps;

const ResumeSale = ({
    classes,
    saleId,
}: Props) => {
    const translations = {
        sale: useTranslation('requestForCv.requestSection.sale'),
    };

    const isMobile = useMobile();

    const SectionLayout = isMobile ? ResumeSaleMobile : ResumeSaleDesktop;

    return (
        <SectionLayout
            saleId={saleId}
            translateSale={translations.sale}
        />
    );
};

export default withRouter(ResumeSale);
