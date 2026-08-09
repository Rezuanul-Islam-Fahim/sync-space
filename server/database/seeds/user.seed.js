/**
 * Provides initial seed user dataset for non-production database seeding.
 *
 * @returns {Promise<Array<{
 *   email: string,
 *   username: string,
 *   password: string,
 *   displayName: string,
 *   dateOfBirth: Date
 * }>>}
 */
export const getSeedUsers = async () => {
    return [
        {
            email: 'test1@test.com',
            username: 'testuser1',
            password: 'password123',
            displayName: 'Test User 1',
            dateOfBirth: new Date('1995-04-15'),
        },
        {
            email: 'test2@test.com',
            username: 'testuser2',
            password: 'password123',
            displayName: 'Test User 2',
            dateOfBirth: new Date('1992-07-10'),
        },
        {
            email: 'test3@test.com',
            username: 'testuser3',
            password: 'password123',
            displayName: 'Test User 3',
            dateOfBirth: new Date('1998-11-05'),
        },
        {
            email: 'test4@test.com',
            username: 'testuser4',
            password: 'password123',
            displayName: 'Test User 4',
            dateOfBirth: new Date('2002-01-17'),
        },
    ];
};
