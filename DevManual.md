# IdeaFactory Backend Repository
##
1. Install [node.js](https://nodejs.org/en/). To ensure that you properly downloaded it, type `npm -v` in the terminal. This will diplsay the currently installed version, and make sure you have v19.9.0
2. Clone ths repo.
3. Install Dependencies:
    ```
    npm install
    ```
4. Start the server:
    ```
    node app.js
    ```
5. To test the backend server
    ```
    npm test
    ```


## Base URL
The base URL for all API endpoints is: http://localhost:3000

## Error Handling
If an error occurs during the execution of an API endpoint (database error or network error), the response will have a status code of 500 and include an error message in the response body. If missing one or more parameters, the response will have a status code of 400.

## User API

### Create a new user

- URL: `/user/create`
- Method: POST
- Description: Creates a new user.
- Request Body:
  - `uid` (string): User ID
- Response:
  - Status: 200 OK
  - Body: "create user successful"

### Update user's info

- URL: `/patchBasicInfo/:uid`
- Method: POST
- Description: Updates a user's basic information.
- Request URL Parameters:
  - `uid` (string): User ID
- Request Body:
  - `username` (string): User's username
  - `contact` (string): User's contact information
  - `location` (string): User's location
  - `summary` (string): User's bio/summary
  - `resume` (string): User's resume
- Response:
  - Status: 200 OK
  - Body: JSON object representing the update result

### Update user's joined projects

- URL: `/update/attend`
- Method: POST
- Description: Updates the projects a user has joined.
- Request Body:
  - `uid` (string): User ID
  - `attend` (array): Array of project IDs that the user has joined
- Response:
  - Status: 200 OK
  - Body: JSON object representing the update result

### Get a specific user by UID

- URL: `/user/:uid`
- Method: GET
- Description: Retrieves a specific user by UID.
- Request URL Parameters:
  - `uid` (string): User ID
- Response:
  - Status: 200 OK
  - Body: JSON object representing the user


## Project API

### Get all projects

- URL: `/projects`
- Method: GET
- Description: Retrieves all projects.
- Parameters:
  - `page` (optional): Page number for pagination (default: 1).
  - `pageSize` (optional): Number of projects per page (default: 10).
- Response:
  - Status: 200 OK
  - Body: JSON array containing project objects.

### Get a specific project

- URL: `/project/:id`
- Method: GET
- Description: Retrieves a specific project by its ID.
- Parameters:
  - `id`: ID of the project.
- Response:
  - Status: 200 OK
  - Body: JSON object representing the project.

### Create a new project

- URL: `/post`
- Method: POST
- Description: Creates a new project.
- Request Body: JSON object representing the new project.
  - `pname`: Project name.
  - `preview`: Project preview.
  - `detail`: Project details.
  - `owner`: Owner of the project.
  - `location`: Project location.
  - `roles`: Project roles.
- Response:
  - Status: 200 OK
  - Body: JSON object containing the ID of the newly created project.

### Update a project

- URL: `/update/project`
- Method: POST
- Description: Updates a project.
- Request Body: JSON object representing the updated project.
  - `id`: ID of the project to update.
  - `pname`: Updated project name.
  - `preview`: Updated project preview.
  - `detail`: Updated project details.
  - `owner`: Updated project owner.
  - `location`: Updated project location.
  - `roles`: Updated project roles.
- Response:
  - Status: 200 OK
  - Body: "updated" (string) indicating the project was successfully updated.

### Remove a project

- URL: `/delete/:id`
- Method: GET
- Description: Removes a project.
- Parameters:
  - `id`: ID of the project to remove.
- Response:
  - Status: 200 OK
  - Body: "removed" (string) indicating the project was successfully removed.

### Search projects

- URL: `/projects/:text`
- Method: GET
- Description: Searches projects by project name.
- Parameters:
  - `page` (optional): Page number for pagination (default: 1).
  - `pageSize` (optional): Number of projects per page (default: 10).
  - `text`: Text to search for in project names.
- Response:
  - Status: 200 OK
  - Body: JSON array containing matching project objects.

### Get count of projects

- URL: `/projects/count`
- Method: GET
- Description: Retrieves the count of projects.
- Response:
  - Status: 200 OK
  - Body: Number representing the count of projects.

