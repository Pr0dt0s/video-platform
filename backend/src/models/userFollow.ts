import { DatabaseModels } from 'models';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './_db';

type UserFollowAttributes = {
    id: number;
    followee: string;
    followed: string;
};

interface UserFollowCreationAttributes
    extends Optional<UserFollowAttributes, 'id'> {}

export class UserFollow extends Model<
    UserFollowAttributes,
    UserFollowCreationAttributes
> {
    static assosiate(models: DatabaseModels) {
        UserFollow.belongsTo(models.User, {
            foreignKey: 'followee',
        });
        UserFollow.belongsTo(models.User, {
            foreignKey: 'followed',
        });
    }
}

UserFollow.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        followee: {
            type: DataTypes.UUIDV4,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        followed: {
            type: DataTypes.UUIDV4,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
    },
    {
        sequelize: sequelize,
        modelName: 'UserFollow',
    }
);

UserFollow.addHook('beforeCreate', async (userFollow) => {
    const followee = userFollow.getDataValue('followee');
    const followed = userFollow.getDataValue('followed');
    if (followee === followed) {
        throw 'user cant follow himself.';
    }
    if (
        await UserFollow.findOne({
            where: {
                followed,
                followee,
            },
        })
    ) {
        throw `user '${followee}' already following user '${followed}'.`;
    }
});

export default UserFollow;
