const path = require('path');
const { SRC_PATH } = require('./constants');

module.exports = {
    'crm-helpers': path.join(SRC_PATH, 'helpers'),
    'crm-roles': path.join(SRC_PATH, 'constants/roles.js'),
    'crm-actions': path.join(SRC_PATH, 'actions'),
    'crm-api': path.join(SRC_PATH, 'api'),
    'crm-constants': path.join(SRC_PATH, 'constants'),
    'crm-components': path.join(SRC_PATH, 'components'),
    'crm-containers': path.join(SRC_PATH, 'containers'),
    'crm-types': path.join(SRC_PATH, 'types'),
    'crm-utils': path.join(SRC_PATH, 'utils'),
    'crm-hooks': path.join(SRC_PATH, 'hooks'),
    'crm-stores': path.join(SRC_PATH, 'stores'),
    'crm-styles': path.join(SRC_PATH, 'styles'),
    'crm-ui': path.join(SRC_PATH,'components/crmUI'),
    'crm-static': path.join(SRC_PATH, 'static'),
    'crm-i18n': path.join(SRC_PATH, 'i18n'),
    'crm-icons': path.join(SRC_PATH, 'components/crmUI/CRMIcons')
};
