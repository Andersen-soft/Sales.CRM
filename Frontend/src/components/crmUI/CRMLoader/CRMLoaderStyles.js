// @flow

import { GREY } from 'crm-constants/jss/colors';

const CRMLoaderStyles = ({ spacing }: Object) => ({
    loader: {
        position: 'absolute',
        color: GREY,
        top: '50%',
        left: '50%',
        marginTop: spacing(-2.5),
        marginLeft: spacing(-2.5),
        zIndex: 1,
    },
    fixedLoader: {
        position: 'fixed',
    },
});

export default CRMLoaderStyles;
