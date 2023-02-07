## Setup and Running

To start the server you need:

1. Install PostgreSQL;

Run commands in terminal:

2. `npm install`;
3. `npx prisma migrate dev`;
4. `npx prisma generate`;
5. `npm start`.

## Usage

### Registration

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

### Login

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
### Logout

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