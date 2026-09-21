import mongoose from 'mongoose';

/**
 * Auth-bounded-context schema factory.
 *
 * Stored in the `credentials` collection — intentionally separate from the
 * `users` (profile) collection owned by the user module. Only the fields
 * required to authenticate a principal are persisted here.
 *
 * @param {{ autoIndex?: boolean }} [options]
 * @returns {import('mongoose').Schema}
 */
export const createAuthUserSchema = ({ autoIndex } = {}) => {
    const schema = new mongoose.Schema(
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
            ...(autoIndex !== undefined ? { autoIndex } : {}),
        }
    );

    const transform = (doc, ret) => {
        delete ret.__v;
        return ret;
    };

    schema.set('toJSON', { transform });
    schema.set('toObject', { transform });

    return schema;
};

/**
 * Returns the AuthUser Mongoose model for the given connection.
 *
 * @param {import('mongoose').Connection} connection
 * @param {{ autoIndex?: boolean }} [options]
 * @returns {import('mongoose').Model<any>}
 */
export const getAuthUserModel = (connection, { autoIndex } = {}) => {
    if (!connection) {
        throw new Error(
            'Database connection instance is required to resolve getAuthUserModel.'
        );
    }
    if (connection.models?.AuthUser) {
        return connection.models.AuthUser;
    }
    const schema = createAuthUserSchema({ autoIndex });
    return connection.model('AuthUser', schema, 'credentials');
};
