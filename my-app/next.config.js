// @ts-check

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
    if (phase === PHASE_DEVELOPMENT_SERVER) {
        return {
            devServer: {
                fastRefresh: false
            }
        };
    }

    return {
        /* config options for all phases except development here */
    }
}