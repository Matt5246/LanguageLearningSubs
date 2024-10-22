// @ts-check

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
    if (phase === PHASE_DEVELOPMENT_SERVER) {
        return {
            experimental: {
                serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
            },
        };
    }

    return {
        experimental: {
            serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
        },
    }
}