# LinkUp Realtime Chat Application

![hero image](/assets/hero.png)

LinkUp is a real-time chat application that allows users to create chat rooms and communicate with others in real-time. Users can create accounts, log in, create and join chat groups, and share messages and media. The application is built using **MongoDB**, **Express**, **React**, **Node.js**, and **Socket.io**.

### Authors

<span style="color: white;">**Malik Hussein**</span>
[![LinkedIn](https://img.icons8.com/color/16/000000/linkedin-circled.png)](https://www.linkedin.com/in/malikhussein/)
[![GitHub](https://img.icons8.com/color/16/000000/github.png)](https://github.com/Medjai229)<br/>

**<span style="color: white;">**Mohamed Marzouk**</span>**
[![LinkedIn](https://img.icons8.com/color/16/000000/linkedin-circled.png)](https://www.linkedin.com/in/mohamed-marzouk-38aa75286/)
[![GitHub](https://img.icons8.com/color/16/000000/github.png)](https://github.com/MMarzoo)<br/>

<span style="color: white;">**Mahmoud Mohey Eldin**</span>
[![LinkedIn](https://img.icons8.com/color/16/000000/linkedin-circled.png)](https://www.linkedin.com/in/moodyeg/)
[![GitHub](https://img.icons8.com/color/16/000000/github.png)](https://github.com/MoodyEG)<br/>

<span style="color: white;">**Ahmad Yousif**</span>
[![LinkedIn](https://img.icons8.com/color/16/000000/linkedin-circled.png)](https://www.linkedin.com/in/dev-ahmadyousif/)
[![GitHub](https://img.icons8.com/color/16/000000/github.png)](https://github.com/AhmadYousif89)<br/>

## The presentation

[**LinkUp Presentation**](https://docs.google.com/presentation/d/1TitFRNG5WmF0RtF-CoTW61k3OW5bwW5Pr2SIBrvStHY/edit?usp=sharing)<br/>

## Video Demo

[**LinkUp Demo**](https://drive.google.com/file/d/1ab143Nn5-YL-07s-GyXRnoaYx0rVUnb6/view?usp=sharing)<br/>

## Features

- **User Authentication**: Create an account with email/password or social login.
- **Real-time Messaging**: Chat with friends in real-time using WebSockets.
- **Chat Groups**: Create and join chat rooms to communicate with groups.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Installation

### Prerequisites

Ensure that you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (v12.x or above)
- [MongoDB](https://www.mongodb.com/) (set up a local or cloud MongoDB instance)

### Steps to Run Locally

1.  Clone the repository:

    ```bash
    git clone https://github.com/AhmadYousif89/linkup.git
    cd linkup
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Set up environment variables:

    Create a `.env` file in backend directory and add the following variables:

    ```plaintext
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/linkup
    JWT_SECRET=<your-secret-key>
    ```

    Create a `.env` file in client directory and add the following variables:

    ```plaintext
    VITE_CLERK_PUBLISHABLE_KEY=<your-publishable-key>
    VITE_SERVER_API=http://localhost:5000/api
    ```

4.  Start the application:

    Start the backend server from backend directory:

    ```bash
    npm start
    ```

    Start the frontend server from client directory:

    ```bash
    npm run dev
    ```

5.  Navigate to `http://localhost:5173` in your browser to start using the application.

## Future Features

- **Friend System**: Add friends and see their online status.
- **Multi-media Files Sharing**: Share images, videos, and other files.
- **Voice Calling**: Make voice calls with friends in real-time.
- **Video Calling**: Make video calls with friends in real-time.
- **Screen Sharing**: Share your screen with friends in real-time.
- **Push Notifications**: Get notified when friends send new messages.
- **Dark Mode**: Switch to a dark theme for better readability.

## Technologies

This project leverages modern technologies to deliver real-time communication:

- **Frontend**: [React](https://reactjs.org/) with state management and dynamic UI.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for responsive and modern UI design.
- **Backend**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) for RESTful APIs and routing.
- **Database**: [MongoDB](https://www.mongodb.com/) for storing user data, chats, and rooms.
- **Real-time Communication**: [Socket.io](https://socket.io/) for WebSocket-based real-time messaging.
- **Security**: [JWT](https://jwt.io/) + [Clerk](https://clerk.dev/) for secure authentication and authorization.
- **Testing**: [Postman](https://www.postman.com/) for API testing

## Usage

1. **Sign up/Login**: Create an account or log in with existing credentials.
2. **Create/Join Chat Groups**: Create a new chat groups or join an existing one.
3. **Send Messages**: Chat in real-time with friends or group members. Share images, files, and other media.

## API Documentation

- **User Endpoints**:

  1.  `POST /api/user/clerk`<br/>
      **Function**: Sign-up or Sign-in a user with clerk.<br/>
      **Request Body**: { id, email, fullName, image }<br/>

  2.  `GET /api/user?search=Joe`<br/>
      **Function**: Search for user using query<br/>
      **Request Query**: { query.search }<br/>

- **Chat Endpoints**:

  1.  `POST /api/chat/`<br/>
      **Function**: Views chat with a certain user, requires userId.<br/>
      **Request Body**: { userId }<br/>

  2.  `GET /api/chat/`<br/>
      **Function**: Search for private chats for the user.<br/>

  3.  `GET /api/chat/group`<br/>
      **Function**: Search for group chats for the user.<br/>

  4.  `POST /api/chat/group`<br/>
      **Function**: Create a new group chat, requires name of the group and user IDs (minimum 3 including the current user).<br/>
      **Request Body**: { users, name }<br/>

  5.  `PUT /api/chat/rename`<br/>
      **Function**: Rename group chat, requires chatId and chatName.<br/>
      **Request Body**: { chatId, chatName }<br/>

  6.  `PUT /api/chat/groupadd`<br/>
      **Function**: Add a user to the group, requires chatId and userId (must be in the group).<br/>
      **Request Body**: { chatId, userId }<br/>

  7.  `PUT /api/chat/groupremove`<br/>
      **Function**: Remove a user from the group, requires chatId, userId, and must be groupAdmin.<br/>
      **Request Body**: { chatId, userId }<br/>

  8.  `DELETE /api/chat/groupdelete`<br/>
      **Function**: Delete a group, requires chatId and must be groupAdmin.<br/>
      **Request Body**: { chatId }<br/>

  9.  `PUT /api/chat/groupquit`<br/>
      **Function**: Quit a group, requires chatId.<br/>
      **Request Body**: { chatId }<br/>

  10. `PUT /api/chat/close`<br/>
      **Function**: Close a chat for a certain user, requires chatId.<br/>
      **Request Body**: { chatId }<br/>

- **Message Endpoints**:

  1.  `POST /api/message/`<br/>
      **Function**: Send a message to a user, requires content and chatId.<br/>
      **Request Body**: { content, chatId }<br/>

  2.  `GET /api/message/:chatId`<br/>
      **Function**:Get all messages in a chat, requires chatId.<br/>
      **Request Param**: { chatId }<br/>

## Contributing

Contributions are welcome! Here's how you can get involved:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please make sure your code follows the project's [code style guidelines](#).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
