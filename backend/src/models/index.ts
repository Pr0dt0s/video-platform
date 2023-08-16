import { User } from './user';
import { Video } from './video';
import { UserFollow } from './userFollow';

const models = {
    User,
    Video,
    UserFollow,
} as const;

export type DatabaseModels = typeof models;

Object.keys(models).forEach((modelName: keyof typeof models) => {
    models[modelName]?.assosiate?.(models);
});
