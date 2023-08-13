import type { UUID } from 'crypto';

declare global {
    namespace Express {
        interface Request {
            id: UUID;
        }
    }
    namespace http {
        class IncomingMessage {
            id: UUID;
        }
    }
}

export {};
