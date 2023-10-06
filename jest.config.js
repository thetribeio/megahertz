module.exports = {
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
    ],
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.[jt]sx?$': [
            'ts-jest',
        ],
    },
    moduleNameMapper: {
        'src/(.*)': '<rootDir>/src/$1',
        'tests/(.*)': '<rootDir>/tests/$1'
    },
    setupFiles: ['jest-date-mock']
};
