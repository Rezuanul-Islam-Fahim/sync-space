import mongoose from 'mongoose';

/**
 * Unified user schema — single source of truth for the `users` collection.
 *
 * Note: UserReaderAdapter always queries with `.select('-password')` to exclude
 * the credential field from profile reads.  AuthUserReaderAdapter reads the full
 * document (password included) as required for credential verification.
 */
const userSchema = new mongoose.Schema(
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
