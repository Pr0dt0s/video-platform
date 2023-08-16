import { DatabaseModels } from 'models';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './_db';
import bcrypt from 'bcrypt';

type UserAttributes = {
    id: string;
    name: string;
    email: string;
    password: string;
    newPassword: string;
    confirmNewPassword: string;
};

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> {
    validatePassword(candidatePassword: string) {
        return new Promise<boolean>((resolve, reject) => {
            bcrypt.compare(
                candidatePassword,
                this.getDataValue('password'),
                function (err, isMatch) {
                    if (err) reject(err);
                    resolve(isMatch);
                }
            );
        });
    }

    public toExpressUser: () => Express.User = () => {
        return {
            id: this.getDataValue('id'),
            name: this.getDataValue('name'),
            email: this.getDataValue('email'),
        };
    };

    static assosiate(models: DatabaseModels) {
        User.hasMany(models.Video, {
            as: 'publishedVideos',
            foreignKey: 'owner',
        });
        User.hasMany(models.UserFollow, {
            as: 'follows',
            foreignKey: 'followee',
        });
        User.hasMany(models.UserFollow, {
            as: 'beingFollowedBy',
            foreignKey: 'followed',
        });
    }
}

User.init(
    {
        id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true,
            },
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
            },
            unique: true,
        },
        password: DataTypes.STRING,
        newPassword: { type: DataTypes.VIRTUAL, allowNull: true },
        confirmNewPassword: { type: DataTypes.VIRTUAL, allowNull: true },
    },
    {
        sequelize: sequelize,
        modelName: 'User',
    }
);

function setUserPassword(user: User) {
    const newPassword = user.getDataValue('newPassword');
    const confirmNewPassword = user.getDataValue('confirmNewPassword');

    if (newPassword !== confirmNewPassword) throw 'Passwords dont match.';
    if (newPassword.length < 6)
        throw 'Password must be at least 6 characters long.';

    const saltRounds = 10;
    const hash = bcrypt.hashSync(newPassword, saltRounds);
    user.setDataValue('password', hash);
}

User.addHook('beforeCreate', (user) => {
    user.set('newPassword', user.getDataValue('password'));
    user.set('confirmNewPassword', user.getDataValue('password'));
    setUserPassword(user as User);
});

User.addHook('beforeUpdate', (user) => {
    const newPassword = user.getDataValue('newPassword');
    const confirmNewPassword = user.getDataValue('confirmNewPassword');
    if (newPassword || confirmNewPassword) {
        setUserPassword(user as User);
    }
});

declare global {
    namespace Express {
        interface User {
            id: string;
            name: string;
            email: string;
        }
    }
}

export default User;
