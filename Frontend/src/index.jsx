// @flow

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createMuiTheme } from '@material-ui/core/styles';
import { MobileContextProvider } from 'crm-components/common/MobileContextProvider/MobileContextProvider';
import App from 'crm-containers/App';
import HotApp from 'crm-containers/HotApp';
import configureStore from 'crm-stores/configureStore';
import CRMMuiThemeProvider from 'crm-components/common/CRMMuiThemeProvider/CRMMuiThemeProvider';
import LanguageContextProvider from 'crm-components/common/LanguageContextProvider/LanguageContextProvider';
import MuiPickersProvider from 'crm-components/common/MuiPickersProvider/MuiPickersProvider';

const store = configureStore();

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
});

const Root = document.getElementById('root');

if (Root !== null) {
    render(
        <Provider store={store}>
            <MobileContextProvider>
                <CRMMuiThemeProvider theme={theme}>
                    <LanguageContextProvider>
                        <MuiPickersProvider>
                            {process.env.NODE_ENV === 'development' ? <HotApp /> : <App />}
                        </MuiPickersProvider>
                    </LanguageContextProvider>
                </CRMMuiThemeProvider>
            </MobileContextProvider>
        </Provider>,
        Root,
    );
}
