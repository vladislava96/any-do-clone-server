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

## Usage

<details><summary>Registration</summary>

- URL

  /api/registration

- Method

  `POST`

- Success Response:

  Code: 201 Created

  Content:
  ```json
  {
    "id": 1,
    "name": "Victor",
    "email": "vvv87@mail.com",
  }
  ```
- Error Response:

  Code: 400 Bad Request

  Content:

  ```json
  {
    "message": "User with this email address already exist."
  }
  ```
  or
  ```json
  {
    "message": "Validation error.",
    "errors": [
      {
        "value": "bfhdsg",
        "msg": "The password must be 8 characters long.",
        "param": "password",
        "location": "body"
      }
    ]
  }
  ```
</details>

<details><summary>Login</summary>

- URL

  /api/login

- Method

  `POST`

- Success Response:

  Code: 200 OK

  Content:
  ```json
  {
    "key": "86949f64-f21e-4f22-afce-87d425a4716f",
    "userId": 6
  }
  ```
- Error Response:

  Code: 400 Bad Request

  Content:

  ```json
  {
    "message": "User with this email address does not exist."
  }
  ```
  or
  ```json
  {
    "message": "Wrong password entered."
  }
  ```
</details>

<details><summary>Logout</summary>

- URL

  /api/logout

- Method

  `POST`

- Headers

  'Api-Key': '86949f64-f21e-4f22-afce-87d425a4716f'

- Success Response:

  Code: 200 OK

  Content:
  ```json
  {
    "key": "86949f64-f21e-4f22-afce-87d425a4716f",
    "userId": 6
  }
  ```
- Error Response:

  Code: 401 Unauthorized

  Content:

  ```json
  {
    "message": "User is not authorized."
  }
  ```
</details>

<details><summary>Getting users</summary>

- URL

  /api/users

- Method

  `GET`

- Success Response:

  Code: 200 OK

  Content:
  ```json
  [{
    "name": "Victor",
    "email": "vvv87@mail.com"
  }]
  ```
- Error Response:

  Code: 400 Bad Request

  Content:

  ```json
  {
    "message": "Bad request."
  }
  ```
</details>

<details><summary>Getting quotes</summary>

- URL

  /api/quotes

- Method

  `GET`

- Success Response:

  Code: 200 OK

  Content:
  ```json
  [{
    "text": "Вы не будете расти, если не будете пытаться совершить что-то за пределами того, что вы уже знаете в совершенстве.",
    "author": "Ральф Эмерсон"
  }]
  ```
- Error Response:

  Code: 400 Bad Request

  Content:

  ```json
  {
    "message": "Bad request."
  }
  ```
</details>

<details><summary>Getting random quote</summary>

- URL

  /api/quotes/random

- Method

  `GET`

- Success Response:

  Code: 200 OK

  Content:
  ```json
  {
    "text": "Вы не будете расти, если не будете пытаться совершить что-то за пределами того, что вы уже знаете в совершенстве.",
    "author": "Ральф Эмерсон"
  }
  ```
- Error Response:

  Code: 400 Bad Request

  Content:

  ```json
  {
    "message": "Bad request."
  }
  ```
</details>