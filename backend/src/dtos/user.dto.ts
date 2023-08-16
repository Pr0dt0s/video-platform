import { z } from 'zod';

const PASSWORD_LENGTH = 6;

const passwordSchema = z
    .string()
    .min(PASSWORD_LENGTH)
    .regex(/[0-9]/, 'must contain at least 1 number')
    .regex(/[a-z]/, 'must contain at least 1 undercase letter')
    .regex(/[A-Z]/, 'must contain at least 1 uppercase letter')
    .regex(/[^0-9a-zA-Z]/, 'must contain at least 1 special character');

const UserCreateSchema = z
    .object({
        name: z.string().nonempty(),
        email: z.string().email(),
        password: passwordSchema,
    })
    .required();

export type UserCreateDTO = z.infer<typeof UserCreateSchema>;
export const parseUserCreateDTO = (payload: unknown) => {
    return UserCreateSchema.safeParse(payload);
};

const UserUpdateSchema = UserCreateSchema.omit({
    password: true,
}).extend({
    newPassword: passwordSchema.optional(),
    confirmNewPassword: passwordSchema.optional(),
});

export type UserUpdateDTO = z.infer<typeof UserUpdateSchema>;

export const parseUserUpdateDTO = (payload: unknown) => {
    return UserUpdateSchema.safeParse(payload);
};

const FollowUserSchema = z.object({
    user: z.string().uuid().nonempty(),
});

export type FollowUserDTO = z.infer<typeof FollowUserSchema>;

export const parseFollowUserDTO = (payload: unknown) => {
    return FollowUserSchema.safeParse(payload);
};
