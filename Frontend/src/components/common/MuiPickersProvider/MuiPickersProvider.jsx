// @flow

import React, { useContext } from 'react';
import type { Node } from 'react';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { LocalizedUtils } from 'crm-components/common/pickers';
import ruLocale from 'date-fns/locale/ru';
import enLocale from 'date-fns/locale/en-GB';

import { IsLanguageContext } from 'crm-components/common/LanguageContextProvider/LanguageContextProvider';

type Props = { children: Node };

const MuiPickersProvider = ({ children }: Props) => {
    const { locale } = useContext(IsLanguageContext);
    const localePicker = (locale === 'en') ? enLocale : ruLocale;

    return (
        <MuiPickersUtilsProvider utils={LocalizedUtils} locale={localePicker}>
            {children}
        </MuiPickersUtilsProvider>
    );
};

export default MuiPickersProvider;
