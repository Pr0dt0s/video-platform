import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    passWithNoTests: false,
    moduleDirectories: ['node_modules', 'src'],
    transform: {
        '^.+\\.(t|j)sx?$': '@swc/jest',
    },
};

export default config;
