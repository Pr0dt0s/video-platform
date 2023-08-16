import { Response, Router } from 'express';
import { parseFollowUserDTO, parseUserCreateDTO } from '../dtos/user.dto';
import { User } from '../models/user';
import { generateAccessTokens } from './authRouter';
import { UserFollow } from '../models/userFollow';
import { Video } from '../models/video';
import { authenticate } from '../middlewares/auth';

const error400 = (
    res: Response,
    error: unknown = { error: 'Bad request.' }
) => {
    res.status(400).send(error);
};

const error404 = (
    res: Response,
    error: unknown = { error: 'Resource not found.' }
) => {
    res.status(404).send(error);
};

const error500 = (
    res: Response,
    error: unknown = { error: 'Internal server error.' }
) => {
    res.status(500).send(error);
};

const ifDev = (payload: unknown) => {
    if (process.env.NODE_ENV === 'production') return undefined;
    return payload;
};

export const createUserRouter = () => {
    const userRouter = Router();

    userRouter.get('/:id', authenticate(), async (req, res) => {
        const id = req.params.id;

        const queriedUser = await User.findByPk(id, {
            include: [
                {
                    model: Video,
                    as: 'publishedVideos',
                    separate: true,
                    attributes: {
                        include: ['url'],
                    },
                },
                {
                    model: UserFollow,
                    as: 'follows',
                    separate: true,
                    attributes: {
                        include: ['followee'],
                    },
                },
                {
                    model: UserFollow,
                    as: 'beingFollowedBy',
                    separate: true,
                    attributes: {
                        include: ['followed'],
                    },
                },
            ],
        });

        if (!queriedUser) return error404(res);

        const userData = queriedUser.get();

        return res.status(200).send({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            publishedVideos: userData['publishedVideos'],
            follows: userData['follows'],
            beingFollowedBy: userData['beingFollowedBy'],
        });
    });

    userRouter.post('/follow', authenticate(), async (req, res) => {
        const parseResult = parseFollowUserDTO(req.body);

        if (!parseResult.success) {
            return error400(res, ifDev(parseResult.error));
        }

        if (req.user?.id === parseResult.data.user) return error400(res);
        try {
            await UserFollow.create({
                followee: req.user!.id,
                followed: parseResult.data.user,
            });

            return res.status(200).send({
                message: 'sucess',
            });
        } catch (error) {
            if (process.env.NODE_ENV === 'production') return error500(res);
            return error500(res, error);
        }
    });

    userRouter.post('/unfollow', authenticate(), async (req, res) => {
        const parseResult = parseFollowUserDTO(req.body);

        if (!parseResult.success) {
            return error400(res, ifDev(parseResult.error));
        }
        const userFollow = await UserFollow.findOne({
            where: {
                followee: req.user!.id,
                followed: parseResult.data.user,
            },
        });

        if (!userFollow) {
            return error404(res);
        }

        try {
            await userFollow.destroy();

            return res.status(200).send({
                message: 'sucess',
            });
        } catch (error) {
            if (process.env.NODE_ENV === 'production') return error500(res);
            return error500(res, error);
        }
    });

    userRouter.post('/', async (req, res) => {
        const newUser = parseUserCreateDTO(req.body);
        if (!newUser.success) {
            return error400(res);
        }
        try {
            const createdUser = await User.create({
                ...newUser.data,
                newPassword: newUser.data.password,
                confirmNewPassword: newUser.data.password,
            });
            const expressUser = createdUser.toExpressUser();

            return res.status(201).send({
                ...generateAccessTokens(expressUser),
                user: expressUser,
            });
        } catch (error) {
            console.error(req.id, error);
            error500(res);
        }
    });

    return userRouter;
};
