import { configure } from '@storybook/react';

const getComponentApp = () => {
    const components = require.context('../src/', true, /\.stories\.js$/);
    components.keys().forEach(filename => components(filename));
};

function loadStories() {
    getComponentApp();
}

configure(loadStories, module);
