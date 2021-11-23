import mysql from 'mysql2/promise';
import { SlackUser } from './slackUser';

async function dbConnect(){
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
}

async function deleteAllUsers(){
    const connection = await dbConnect();
    connection.connect();
    try {
        await connection.execute('delete from slack_users');
    } finally {
        connection.end();
    }
}

async function userExists(id: string): Promise<boolean> {
    const connection = await dbConnect();
    connection.connect();
    try {
        const [rows] = await connection.execute('select count(1) as c from slack_users su where id = ?', [id]);
        // @ts-expect-error
        return rows[0]["c"] > 0;
    } finally {
        connection.end();
    }
}

async function upsertUser(data: SlackUser){
    const exists = await userExists(data.id); 
    if (exists) {
        await updateUser(data, data.id);
    } else {
        await insertUser(data);
    }
}

async function insertUser(data: SlackUser) {
    const connection = await dbConnect();

    connection.connect();
    try {
        const { id, name, real_name, tz, status_text, status_emoji, image_512 } = data;
        await connection.execute('insert into slack_users(id, name, deleted, real_name, tz, status_text, status_emoji, image_512) values(?, ?, ?, ?, ?, ?, ?, ?)',
            [id, name, "N", real_name, tz, status_text, status_emoji, image_512]);
    } finally {
        connection.end();
    }
}

async function updateUser(data: SlackUser, id: string) {
    const connection = await dbConnect();

    connection.connect();
    try {
        const { name, deleted, real_name, tz, status_text, status_emoji, image_512 } = data;

        await connection.execute('update slack_users set name = ?, deleted = ?, real_name = ?, tz = ?, status_text = ?, status_emoji = ?, image_512 = ? where id = ?',
            [name, deleted, real_name, tz, status_text, status_emoji, image_512, id]);
    } finally {
        connection.end();
    }
}

async function listUsers(){
    const connection = await dbConnect();

    connection.connect();
    try {
        const [rows] = await connection.execute('select id, name, deleted, real_name, tz, status_text, status_emoji, image_512 from slack_users where deleted = "N"');
        return rows;
    } finally {
        connection.end();
    }
}

export { insertUser, updateUser, upsertUser, listUsers, deleteAllUsers }