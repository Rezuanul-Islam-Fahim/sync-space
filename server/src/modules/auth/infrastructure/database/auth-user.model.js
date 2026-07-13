import mongoose from 'mongoose';

const authUserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            minLength: 3,
            maxLength: 30,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const transform = (doc, ret) => {
    delete ret.__v;
    return ret;
};

authUserSchema.set('toJSON', { transform });
authUserSchema.set('toObject', { transform });

export const AuthUserModel = mongoose.model('AuthUser', authUserSchema, 'users');
