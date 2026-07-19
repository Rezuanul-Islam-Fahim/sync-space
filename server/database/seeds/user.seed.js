import { BcryptPasswordHasher } from '../../src/shared/infrastructure/index.js';
import { config } from '../../src/config/index.js';

export const getSeedUsers = async () => {
    const saltRounds = config.auth.saltRounds || 10;
    const passwordHasher = new BcryptPasswordHasher({ saltRounds });
    const hashedPassword = await passwordHasher.hash('password123');

    return [
        {
            email: 'test1@test.com',
            username: 'testuser1',
            password: hashedPassword,
            displayName: 'Test User 1',
            dateOfBirth: new Date('1995-04-15'),
        },
        {
            email: 'test2@test.com',
            username: 'testuser2',
            password: hashedPassword,
            displayName: 'Test User 2',
            dateOfBirth: new Date('1992-07-10'),
        },
        {
            email: 'test3@test.com',
            username: 'testuser3',
            password: hashedPassword,
            displayName: 'Test User 3',
            dateOfBirth: new Date('1998-11-05'),
        },
        {
            email: 'test4@test.com',
            username: 'testuser4',
            password: hashedPassword,
            displayName: 'Test User 4',
            dateOfBirth: new Date('2002-01-17'),
        },
    ];
};
