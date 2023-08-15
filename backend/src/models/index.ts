import User from './user';
import Video from './video';

const models = {
    User,
    Video,
};

export type DatabaseModels = typeof models;

Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});
