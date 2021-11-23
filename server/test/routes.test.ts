// @ts-nocheck

require("dotenv").config({ path: process.env.ENV_FILE });

import { insertUser, deleteAllUsers, updateUser } from "../repository";
import { SlackUser } from "../slackUser";
import assert from "assert";
import chai from "chai";
import chaiHttp from "chai-http";
import server from "../index";

chai.use(chaiHttp);

describe("api routes", () => {

    beforeEach(async () => {
        await deleteAllUsers();
    });

    it("should list users", async () => {
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

        const response = await chai.request(server).get("/users");

        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.length, 1);
    });

    it("should list only not deleted users", async () => {
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

        const user2 = new SlackUser(
            "abc1234",
            "test user",
            false,
            "real test user name",
            "America/Sao_Paulo",
            "available",
            ":thumbs_up:",
            "http://image.svg"
        );

        await Promise.all([
            insertUser(user),
            insertUser(user2)
        ]);

        const deletedUser = {
            ...user2,
            deleted: "S"
        };

        await updateUser(deletedUser, deletedUser.id);

        const response = await chai.request(server).get("/users");

        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.length, 1);
    });
});