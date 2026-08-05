import mongoose from 'mongoose';

/**
 * Auth-bounded-context schema.
 *
 * Stored in the `credentials` collection — intentionally separate from the
 * `users` (profile) collection owned by the user module.  Only the fields
 * required to authenticate a principal are persisted here.
 */
const authUserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
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

export const getAuthUserModel = (connection = mongoose) => {
    return (
        connection.models?.AuthUser ||
        connection.model('AuthUser', authUserSchema, 'credentials')
    );
};

export const AuthUserModel = getAuthUserModel(mongoose);
