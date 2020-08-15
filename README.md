<p align="center">

  <h1 align="center">
    Authentication System that can used as a base to build any website.
    <br>
  </p>

  <h3 align="center">
    Tech Stack: HTML, CSS, Javascript, Express, MongoDB
  </p>
</p>


### Features

- [x] Sign up Using Google - Google Authorization
- [x] Sign up using Email
- [x] Reset Password
- [x] Forgot Password
- [x] Send emails to users

### Documentation

<strong>Documentation to set up the google credientials.</strong>

1. Go to https://console.developers.google.com
2. Create a new project, give name to it and leave location as it is. Navigate to this project.
3. Go to credentials in the dashboard.
4. Click on create credentials given on the top.
5. Click on OAuth client ID.
6. Click on configure consent screen, fill application name and save.
7. Again, click on OAuth client ID.
8. Choose web application as app type, give app name.
9. Authorized JS origins : http://localhost:8000
10. Authorized redirect URIs: http://localhost:8000/users/auth/google/callback
11. Click on create.
12. Save client ID and Client secret and put this .env file.

<strong>Documentation to set up the google email account for mailer.</strong>

1. Create a google account.
2. Put google account and password as mentioned in the comments.
3. Make google account less secure by visiting the link https://www.google.com/settings/security/lesssecureapps

<strong>Documentation to set up the project is given in this section.</strong>

1. Clone this project.
2. Install nodejs, npm, mongodb if you don't have.
3. Install the dependencies given in package.json.
4. Navigate to the project directory.
5. Run the following commands.

```console
$ npm install
$ npm start or nodemon index.js
```
