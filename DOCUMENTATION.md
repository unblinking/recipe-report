# Table of contents  

[What is Recipe.Report?](#what-is-recipe-report)  
[Base URL](#base-url)  
[Headers](#headers)  
[Responses](#responses)  
[Requests](#requests)  
[Root](#requests-root)  
└ [User](#requests-user)  
· └ [Registration](#requests-user-registration)  

---  

<a id="what-is-recipe-report"></a>
## What is Recipe.Report?  

Recipe.Report is an application to help know more about food, to help get more food for the money.  

This is the official documentation for the Recipe.Report API server.  

This API is designed to have predictable resource-oriented URLs, and accepts both x-www-form-urlencoded and JSON request bodies. It returns JSON-encoded responses, and uses the standard HTTP response codes and verbs.  

---  

<a id="base-url"></a>
## Base URL  

All API requests need to begin with the following base URL:  

```
https://api.recipe.report
```

---  

<a id="headers"></a>
## Headers  

Be sure to add a `Content-Type` header to `POST` and `PUT` requests with the value of `application/json`. Also supported is `application/x-www-form-urlencoded` but `application/json` is recommended.  

---  

<a id="responses"></a>
## Responses  

All response bodies are based on the [JSend specification](https://github.com/omniti-labs/jsend) by omniti-labs.  

Here is the JSend interface definition from the Recipe.Report API server source code:  

```ts
import { Response } from 'express'
export interface Jsend {
  success(res: Response, data?: Record<string, unknown>): void
  fail(res: Response, data?: Record<string, unknown>): void
  error(
    res: Response,
    message: string,
    code?: string,
    data?: Record<string, unknown>
  ): void
}
```

Each response will include a `status` key, which will be one of `success`, `fail`, or `error`. A `success` or `fail` status will can also include a `data` key. An `error` status will also include a `message` key to provide additional information about the error, and can include `code` and `data` keys.  

Example success response:  

```json
{
    "status": "success"
}
```

Example error response:  

```json
{
    "status": "error",
    "message": "Error registering user: Username is already in use.",
    "code": "500"
}
```

For more details on how responses are processed and formatted, see the [`responder-service.ts`](modules/services_responder_service.html) file.  

---  

<a id="requests"></a>
## Requests  

<a href="requests-root"></a>
### Root  

Route: `/`  

Say hello to the Recipe.Report API server.  

Example:  

```bash
curl --location --request GET 'https://api.recipe.report/'
```

<a href="requests-user"></a>
### User  

Route: `/user`  

Manage user actions.  

<a href="requests-user-registration"></a>
#### User Registration  

Route: `/user/register`  

New user registration.  

Example:   

```bash
curl --location --request POST 'http://api.recipe.report/user/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "newuser",
    "password": "onesmallstepforsomeone",
    "email_address": "newuser@recipe.report"
}'
```

Request parameters:  

Key|Type|Required|Notes
--|--|--|--
username|string|yes|Must be unique, can't already be in use.
password|string|yes|Must be sufficiently complex. Password strength is estimated using zxcvbn. Passwords with low scores are rejected with feedback to help guide users towards less guessable passwords.
email_address|string|yes|Must be unique, can't already be in use.
