'use strict';

import { DatabaseModels } from 'models';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './_db';

type VideoAttributes = {
    id: string;
    url: string;
    owner: string;
    description: string;
    published: boolean;
};

interface VideoCreationAttributes extends Optional<VideoAttributes, 'id'> {}

export class Video extends Model<VideoAttributes, VideoCreationAttributes> {
    static assosiate(models: DatabaseModels) {
        Video.belongsTo(models.User, { foreignKey: 'id' });
    }
}

Video.init(
    {
        id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        url: DataTypes.STRING,
        description: DataTypes.STRING,
        published: DataTypes.BOOLEAN,
        owner: {
            type: DataTypes.UUIDV4,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'Video',
    }
);
