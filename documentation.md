# Api routes documentation

*Documentation to use this api.
Every request require a token unless authentication and registration.*

## Users

#### Authentication

**<code>POST</code> /auth**

*Parameters :*
- Email
- Password

*Response :*
``` json
{
    "error": false,
    "data": {
        "_id": "577006e44a7b7b7111b4601f",
        "password": "bcrypt hashed password",
        "email": "email@example.com",
        "name": "antoine"
    },
    "token": "jsonwebtoken generated"
}
```

#### Registration

**<code>POST</code> /register**

*Parameters :*
- Name
- Email
- Password

#### Get users list

**<code>GET</code> /users**

*Parameters :*
- Token

*Response :*
``` json
{
    "error": false,
    "data": [
        {
            "_id": "577006e44a7b7b7111b4601f",
            "name": "antoine"
        },
        {
            "_id": "577006e44a7b7b7111b4601f",
            "name": "jean"
        },
        {
            "_id": "577006e44a7b7b7111b4601f",
            "name": "pierre"
        }
    ],
    "token": null
}
```

#### Get user info

**<code>GET</code> /users/:id**

*Parameters :*
- Token

*Response :*
``` json
{
    "error": false,
    "data": {
        "_id": "577006e44a7b7b7111b4601f",
        "name": "antoine"
    },
    "token": null
}
```

#### Change password

**<code>PATCH</code> /users/:id**

*Parameters :*
- Token
- Password

## Snaps

#### Send a snap

URL | Method
----|-------
/snaps | POST

Response :

#### List snaps

URL | Method
----|-------
/snaps | GET

Response :

#### Mark a snap as viewed

URL | Method
----|-------
/snaps/id | PATCH

Response :
