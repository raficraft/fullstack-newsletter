# Fullstack Newsletter Application

This is a Fullstack Newsletter application, a robust solution for managing newsletters and notifications. The backend is hosted on Heroku and the frontend is deployed on Vercel.

![Screenshot](https://fullstack-newsletter-q1l5.vercel.app/screenshot.png)

## Tech Stack

Backend:

- Node.js
- Express
- Prisma
- MySQL
- Jest
- Supertest
- Typescript
- Swagger

Frontend:

- Next.js
- Zustand
- TypeScript
- Jest
- React-testing-library
- Fetch-mock

Merci pour vos précisions, j'ai adapté les descriptions en conséquence :

## Features

- **Subscription Management for Newsletters**<br>
  Manage the subscription of users for newsletters with ease. Efficiently handle signups and make sure your users are updated with the latest information.

- **CRUD Operations for Newsletter Data**<br>
  - **Create**: Easily add new newsletter records to the database.
  - **Read**: List all users subscribed to the newsletter.
  - **Update**: Edit existing newsletter records as and when required.
  - **Delete**: Remove newsletters that are no longer needed, with an added safety measure of a confirmation modal before deletion.<br><br>
- **Email Validation with `validator`**<br>
  Ensure the validity of the email addresses of the users who are subscribing to the newsletter.

- **API Documentation with `swagger-jsdoc`**<br>
  Automatically generate comprehensive API documentation which can be easily accessed and read.

- **Admin Dashboard**<br>
  A dedicated admin dashboard to manage efficiently all the subscribers to the newsletter.

- **Search Functionality**<br>
  Search and find any subscribed user to the newsletter.

- **Subscription Toggle Functionality**<br>
  Allows the administrator to deactivate a newsletter subscription with the option to reactivate it in the future.

- **Data Filtering**<br>
  Quickly filter the data to find the information you need.

- **Responsive Design**<br>
  The application is designed to be responsive, providing a seamless user experience on devices of all sizes.

- **Unit and Integration Testing with Jest**<br>
  The application is thoroughly tested with unit and integration tests using Jest, ensuring each part of the application functions as expected.

## Installation

### Backend

1. **Clone the repository**

   ```sh
   git clone https://github.com/raficraft/fullstack-newsletter.git
   ```

2. **Navigate to the server directory**

   ```sh
   cd fullstack-newsletter/server
   ```

3. **Install NPM packages**

   This project relies on NPM packages. You can install them by running:

   ```sh
   npm install
   ```

4. **Set up Environment Variables**

   Set up the correct environment variables. Create a `.env` file in the root directory of the server directory, and add the following:

   ```env
   DATABASE_URL="mysql://user:password@localhost:4000/database_name"
   ```

   Replace the `user`, `password`, and `database_name` with your MySQL credentials and database name.

5. **Run the migrations**

   You can run the migrations by running the following command in your terminal:

   ```sh
   npm run migrate
   ```

6. **Start the server**

   You can start the server by running the following command in your terminal:

   ```sh
   npm run dev
   ```

   The server should now be up and running locally!

### Frontend

1. **Navigate to the client directory**

   ```sh
   cd fullstack-newsletter/client
   ```

2. **Install NPM packages**

   This project relies on NPM packages. You can install them by running:

   ```sh
   npm install
   ```

3. **Set up Environment Variables**

   Set up the correct environment variables. Create a `.env` file in the root directory of the client directory, and add the necessary environment variables.

4. **Start the server**

   You can start the server by running the following command in your terminal:

   ```sh
   npm run dev
   ```

   The application should now be up and running locally!

## Testing

To run the tests:

- For the backend:

  ```sh
  cd server
  npm test
  ```

- For the frontend:

  ```sh
  cd client
  npm test
  ```

Please note that for the tests to work, the servers need to be running.

## Deployment

The backend of this application is ready to be deployed on Heroku, and the frontend on Vercel. Check out their official documentation to learn how to deploy:

- [Heroku Deployment](https://devcenter.heroku.com/categories/deployment)
- [Vercel Deployment](https://vercel.com/docs/concepts/deployments)

## Licence

This project is licensed under the ISC License.

## Contact

- GitHub: [@raficraft](https://github.com/raficraft)

Happy coding!
