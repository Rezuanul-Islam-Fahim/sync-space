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
    {
        timestamps: true,
        autoIndex: process.env.NODE_ENV !== 'production',
    }
);

const transform = (doc, ret) => {
    delete ret.__v;
    return ret;
};

authUserSchema.set('toJSON', { transform });
authUserSchema.set('toObject', { transform });

export const getAuthUserModel = connection => {
    if (!connection) {
        throw new Error(
            'Database connection instance is required to resolve getAuthUserModel.'
        );
    }
    return (
        connection.models?.AuthUser ||
        connection.model('AuthUser', authUserSchema, 'credentials')
    );
};
