1 - Slack app
Responsible to load current workspace users on the initialization and then update any user
changes by listening a webhook. All the users will be stored in a MySQL database.

2 - Server api app
Responsible to expose the list of users via a rest api endpoint.

3 - Client app
Responsible to make the users list viewable.


---
Database: MySQL 5.7
Backend: NodeJS + express
Frontend: NextJS

---
