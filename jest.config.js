module.exports = {
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
    ],
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.[jt]sx?$': [
            'ts-jest',
            // {
            //     isolatedModules: true,
            // },
        ],
    },
    setupFiles: ['jest-date-mock']
};
