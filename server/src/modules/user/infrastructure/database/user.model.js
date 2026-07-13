import mongoose from 'mongoose';

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
