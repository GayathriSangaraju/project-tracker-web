# Web app - Projects and Tasks Manager

### How to run

1. Install dependencies: `npm install`
2. Start the app: `npm start`
3. The app should now be available at <http://localhost:5173/>
4. To run tests: `npm test`

### Description

- This is a simple web application that allows users to manage their projects and tasks efficiently.
- Users can create, edit, and delete projects and tasks, as well as mark tasks as completed.
- Projects Page: Displays all projects and number of tasks in a project. Each project have actions column to edit or
  delete.
- Project Name is clickable and takes user to Project Details page.
- Project Details Page: Displays project information and users can add/edit/delete tasks associated with the project.
- Tasks: Users cannot edit/delete a completed task.
- Modal forms are used to Add/Edit projects and tasks. I have used simple components and state for managing forms and validation.

### Technologies Used

- React Query for data fetching and state management
- Vitest for testing

### Things to improve

- Using a context to manage form state instead of individual state for each field or using form libraries like React hook forms or Tanstack forms.
- Breaking down components further for better reusability and readability (Using Atomic Design).
- Using useInfiniteQuery for fetching projects and tasks to handle pagination.
- When deleting a project, tasks state is not taken into account. It would be good to notify user if there are any tasks
  which are not completed before deleting the project.
- Using error messages and status codes from the API to show more specific error information to the user.
- Improve styling and user experience
- Write more tests and do behaviour testing for components when required.
- Write end to end tests for critical user flows.
- Other common tools like ESlint, Prettier and Husky for code quality and consistency.
