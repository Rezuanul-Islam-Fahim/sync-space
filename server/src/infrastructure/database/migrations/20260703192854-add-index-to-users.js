/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async db => {
    await db.collection('users').createIndex({ status: 1, lastOnline: -1 });
};

/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const down = async db => {
    await db.collection('users').dropIndex('status_1_lastOnline_-1');
};
