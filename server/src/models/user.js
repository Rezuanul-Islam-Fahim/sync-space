import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
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
