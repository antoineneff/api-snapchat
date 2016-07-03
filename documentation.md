# Api routes documentation

*Documentation to use this api.
Every request require a token unless authentication and registration.*

## Users

#### Authentication

* **<code>POST</code> /auth**

    *Parameters :*
    - email
    - password

    *Response :*
    ``` json
    {
        "error": false,
        "data": {
            "id": "577006e44a7b7b7111b4601f",
            "email": "email@example.com",
            "name": "antoine"
        },
        "token": "jsonwebtoken generated"
    }
    ```

---

#### Registration

* **<code>POST</code> /register**

    *Parameters :*
    - name
    - email
    - password

---

#### Users list

* **<code>GET</code> /users**

    *Parameters :*
    - token

    *Response :*
    ``` json
    {
        "error": false,
        "data": [
            {
                "_id": "577006e44a7b7b7111b4601f",
                "email": "antoine@example.com",
                "name": "antoine"
            },
            {
                "_id": "577006e44a7b7b7111b4601f",
                "email": "jean@example.com",
                "name": "jean"
            },
            {
                "_id": "577006e44a7b7b7111b4601f",
                "email": "pierre@example.com",
                "name": "pierre"
            }
        ],
        "token": null
    }
    ```

---

#### User name

* **<code>GET</code> /users/:id**

    *Parameters :*
    - token

    *Response :*
    ``` json
    {
        "error": false,
        "data": {
            "_id": "577006e44a7b7b7111b4601f",
            "email": "antoine@example.com",
            "name": "antoine"
        },
        "token": null
    }
    ```

---

#### Change password

* **<code>PATCH</code> /users/:id**

    *Parameters :*
    - token
    - password

## Snaps

#### Send a snap

* **<code>POST</code> /snaps**

    *Parameters :*
    - id_receiver
    - duration
    - token
    - snap (file)

---

#### List snaps

* **<code>GET</code> /snaps**

    *Parameters :*
    - token

    *Response :*
    ``` json
    {
        "error": false,
        "data": [
            {
                "_id": "57702bb72d175c2b12dcfc51",
                "url": "skate event.jpg",
                "duration": 5,
                "id_receiver": "577006e44a7b7b7111b4601f",
                "id_sender": "576fe1864cc2b53d0d53d14f",
                "watched": false
            },
            {
                "_id": "57702bb92d175c2b12dcfc52",
                "url": "skate event.jpg",
                "duration": 5,
                "id_receiver": "577006e44a7b7b7111b4601f",
                "id_sender": "576fe1864cc2b53d0d53d14f",
                "watched": false
            }
        ],
        "token": null
    }
    ```

---

#### Mark a snap as viewed

* **<code>PATCH</code> /snaps/:id**

    *Parameters :*
    - token


## Friends

### List friends

* **<code>GET</code> /friends**

    *Parameters :*
    - token

    *Response :*
    ``` json
    {
        "error": false,
        "data": [
            {
                "_id": "5773f4d5c633b5d51dce56c3",
                "email": "valentin@example.com",
                "name": "valentin"
            },
            {
                "_id": "5773f4e0c633b5d51dce56c4",
                "email": "mathias@example.com",
                "name": "mathias"
            }
    ],
        "token": null
    }
    ```

---

### Add a friend

* **<code>POST</code> /friends**

    *Parameters :*
    - token
    - email

---

### List friend requests

* **<code>GET</code> /friends/requests**

    *Parameters :*
    - token

    *Response :*
    ``` json
    {
        "error": false,
        "data": [
            {
                "_id": "5773f4d5c633b5d51dce56c3",
                "email": "valentin@example.com",
                "name": "valentin"
            },
            {
                "_id": "5773f4e0c633b5d51dce56c4",
                "email": "mathias@example.com",
                "name": "mathias"
            }
    ],
        "token": null
    }
    ```

---

### Accept friend request

* **<code>POST</code> /friends/requests/:id**

    *Parameters :*
    - token

---

### Delete a friend

* **<code>DELETE</code> /friends/:id**

    *Parameters :*
    - token
