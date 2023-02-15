## Setup and Running

To start the server you need:

1. Install PostgreSQL, create a password for your database,
2. Create a database,
3. In the `.env` file, `DATABASE_URL`, enter the password and database name.

Run commands in terminal:

1. `npm install`;
2. `npx prisma migrate dev`;
3. `npx prisma generate`;
4. `npm start`.

Documentation: https://any-do-clone-api-doc.netlify.app/