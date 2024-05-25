## Project Structure

- `/src`: Root folder of application.
  - `/src/index.js`: The server bootstrap file.
- `/db`: Handles the database connection logic and model definitions.
- `/routes`: Handles various routes defined in `.routes.js` files.
- `/services`: Contains the business logic of the application.
- `/utils`: Contains helper functions used throughout the project.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd contact-sharing-node`
3. Install dependencies: `npm install`
4. Start the server: `npm run start`

## Usage

Once the server is up and running, you can interact with the API to store and share contact information. Here are some of the available endpoints:

- `/contacts`: 
  - `GET`: Get all contacts.
  - `POST`: Add a new contact.
- `/contacts/:id`: 
  - `GET`: Get a specific contact by ID.
  - `PUT`: Update a contact by ID.
  - `DELETE`: Delete a contact by ID.
- `/contacts/:id/share`: 
  - `POST`: Share contact information with linked contacts.

Make sure to check the API documentation or the codebase for more detailed information on available endpoints and their usage.
