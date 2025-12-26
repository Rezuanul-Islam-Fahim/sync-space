import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            default: null
        },
        bio: {
            type: String,
            maxLength: 190,
            default: null
        },
        banner: {
            type: String,
            default: null,
        },
        bannerColor: {
            type: String,
            default: null,
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['online', 'offline', 'idle', 'dnd'],
            default: 'offline'
        },
        lastOnline: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
)

const transform = (doc, ret) => {
    delete ret.password
    delete ret.__v

    return ret
}

userSchema.set('toJSON', { transform })
userSchema.set('toObject', { transform })

export const User = new mongoose.model('User', userSchema)
