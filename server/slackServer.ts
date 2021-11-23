require("dotenv").config({ path: process.env.ENV_FILE });

import axios from 'axios';
import express from 'express';
import { insertUser, upsertUser } from './repository';
import { SlackUser } from './slackUser';

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());


async function loadCurrentUsers(){
  const resp = await axios.get("https://slack.com/api/users.list?pretty=1",{
    headers: {
      Authorization: `Bearer ${process.env.OAUTH_TOKEN}`
    }
  });

  const {members} = resp.data;

  const users = members.map((member: any) => {
    const {id, name, deleted, tz, real_name, profile: { image_512, status_emoji, status_text }} = member;
    return new SlackUser(
      id, name, deleted, real_name, tz, status_text, status_emoji, image_512
    )
  });

  const userPromises = [];

  for (const user of users) {
    userPromises.push(upsertUser(user));
  }

  await Promise.all(userPromises);
}

(async() => {
  try {
    await loadCurrentUsers();
  } catch (error) {
    console.log("Error", error);
  }
})();

app.post("/webhooks", (req, res) => {
  if (req.body.challenge){
    res.json({challenge: req.body.challenge});
  } else {
    const {event} = req.body;

    const {
        id,
        name,
        deleted,
        real_name,
        tz,
        profile: {
            status_text,
            status_emoji,
            image_512
        }
    } = event.user;

    const user = new SlackUser(
        id,
        name,
        deleted,
        real_name,
        tz,
        status_text,
        status_emoji,
        image_512
    );

    switch (event.type) {
      case "user_change": 
        upsertUser(user);
        break;
      case "team_join":
        insertUser(user);
        break;
      default:
        console.log(event.type);
    }
  }
});

const port = parseInt(process.env.PORT || "3000");

app.listen(port, () => {
  console.log(`SlackApp is running on port ${port}`);
});
