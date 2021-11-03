# What is Recipe.Report?  

Recipe.Report is an application to help know more about food, to help get more food for the money.  

This is the official documentation for the Recipe.Report API server.  

This API is designed to have predictable resource-oriented URLs, and accepts form-encoded request bodies. It returns JSON-encoded responses, and uses the standard HTTP response codes and verbs.

## Base URL  

All API requests need to begin with the following base URL:  

```
https://api.recipe.report
```

## Headers  

This API accepts form-encoded request bodies.  

Add a `Content-Type` header to `POST` requests with the value of `application/x-www-form-urlencoded`.  

## Root  

Route: `/`  

Say hello to the Recipe.Report API server.  

Example:  

```bash
curl --location --request GET 'https://api.recipe.report/'
```

## User  

Route: `/user`  

Manage user actions.  

### Registration  

Route: `/user/register`  

New user registration.  

Example:   

```bash
curl --location --request POST 'https://api.recipe.report/user/register' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'username=newuser' \
--data-urlencode 'password=onesmallstepforsomeone' \
--data-urlencode 'email_address=newuser@recipe.report'
```
