import type { UUID } from 'crypto';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test';
            PORT?: string;
            PWD: string;
        }
    }
}

declare global {
    namespace Express {
        interface Request {
            id: UUID;
        }
    }
}
