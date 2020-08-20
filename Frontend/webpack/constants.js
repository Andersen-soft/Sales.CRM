const path = require('path');

const ROOT_PATH = path.join(__dirname, '..');

exports.ROOT_PATH = ROOT_PATH;
exports.SRC_PATH = path.join(ROOT_PATH, './src');
exports.PUBLIC_PATH = path.join(ROOT_PATH, './public');
exports.SCRIPTS_DIR_NAME = 'scripts';
exports.STYLES_DIR_NAME = 'styles';
