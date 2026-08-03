/**
 * @param db {import('mongodb').Db}
 * @param _client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, _client) => {
    await db.collection('users').createIndex({ status: 1, lastOnline: -1 });
};

/**
 * @param db {import('mongodb').Db}
 * @param _client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const down = async (db, _client) => {
    await db.collection('users').dropIndex('status_1_lastOnline_-1');
};
