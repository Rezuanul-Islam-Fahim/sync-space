import mongoose from 'mongoose';

/**
 * User profile schema — stored in the `users` collection.
 *
 * Owned entirely by the user bounded context.  Credential fields (password,
 * isVerified) are absent; they live in the `credentials` collection managed
 * by the auth module.
 *
 * The `_id` here is set explicitly to the ObjectId produced by the auth module
 * when the `AuthUser` credential record is created, acting as the shared
 * identity across both bounded contexts.
 */
const userSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
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
        displayName: {
            type: String,
            default: null,
        },
        avatar: {
            type: String,
            default: null,
        },
        bio: {
            type: String,
            maxLength: 190,
            default: null,
        },
        banner: {
            type: String,
            default: null,
        },
        bannerColor: {
            type: String,
            default: '#5865F2',
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['online', 'offline', 'idle', 'dnd'],
            default: 'offline',
        },
        lastOnline: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

userSchema.index({ status: 1, lastOnline: -1 }, { sparse: true });

const transform = (doc, ret) => {
    delete ret.__v;
    return ret;
};

userSchema.set('toJSON', { transform });
userSchema.set('toObject', { transform });

export const UserModel = mongoose.model('User', userSchema, 'users');
