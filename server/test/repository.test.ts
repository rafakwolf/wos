// @ts-nocheck

require("dotenv").config({ path: process.env.ENV_FILE });

import { insertUser, updateUser, upsertUser, listUsers, deleteAllUsers } from "../repository";
import { SlackUser } from "../slackUser";
import assert from "assert";

describe("repository", () => {

    beforeEach(async () => {
        await deleteAllUsers();
    });

    it("should insert users", async () => {
       const user = new SlackUser(
           "abc123",
           "test user",
           false,
           "real test user name",
           "America/Sao_Paulo",
           "available",
           ":thumbs_up:",
           "http://image.svg"
       );

       await insertUser(user);

       const insertedUsers = await listUsers();

       assert.strictEqual(insertedUsers[0].name, user.name);
       assert.strictEqual(insertedUsers[0].id, user.id);
    });

    it("should update users", async () => {
        const user = new SlackUser(
            "abc1234",
            "test user",
            false,
            "real test user name",
            "America/Sao_Paulo",
            "available",
            ":thumbs_up:",
            "http://image.svg"
        );
 
        await insertUser(user);
 
        const insertedUsers = await listUsers();

        assert.strictEqual(insertedUsers[0].name, user.name);
        assert.strictEqual(insertedUsers[0].id, user.id);

        const updatedUser = {
            ...user,
            name: "update user"
        };

        await updateUser(updatedUser, user.id);

        const updatedUsers = await listUsers();

        assert.deepStrictEqual(updatedUsers[0].name, updatedUser.name);
        assert.deepStrictEqual(updatedUsers[0].id, updatedUser.id);
    });

    it("should upsert users", async () => {
        const user = new SlackUser(
            "abc12345",
            "test user",
            false,
            "real test user name",
            "America/Sao_Paulo",
            "available",
            ":thumbs_up:",
            "http://image.svg"
        );
 
        await insertUser(user);
 
        const insertedUsers = await listUsers();

        assert.strictEqual(insertedUsers[0].name, user.name);
        assert.strictEqual(insertedUsers[0].id, user.id);

        const updatedUser = {
            ...user,
            name: "update user"
        };

        await upsertUser(updatedUser);

        const updatedUsers = await listUsers();

        assert.deepStrictEqual(updatedUsers[0].name, updatedUser.name);
        assert.deepStrictEqual(updatedUsers[0].id, updatedUser.id);
    });

    it("should list users", async () => {
        const user = new SlackUser(
            "abc12345",
            "test user",
            false,
            "real test user name",
            "America/Sao_Paulo",
            "available",
            ":thumbs_up:",
            "http://image.svg"
        );

        const user2 = new SlackUser(
            "abc123456",
            "test user 2",
            false,
            "real test user name 2",
            "America/Sao_Paulo",
            "available",
            ":thumbs_up:",
            "http://image2.svg"
        );
 
        await Promise.all([
            insertUser(user),
            insertUser(user2)
        ]);
 
        const users = await listUsers();

        assert.strictEqual(users.length, 2);
    });
});