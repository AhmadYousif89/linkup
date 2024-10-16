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

## Video Demo

## Features

- **User Authentication**: Create an account with email/password or social login.
- **Real-time Messaging**: Chat with friends in real-time using WebSockets.
- **Chat Groups**: Create and join chat rooms to communicate with groups.
- **Responsive Design**: Optimized for both desktop and mobile devices.

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

<!-- ## API Documentation

- **User Endpoints**:
   1. `GET /api/user/clerk`<br/>
      **Function**: Sign-up or Sign-in a user with clerk.<br/>
      **Request Body**: { id, email, fullName, image }<br/>

   2. `POST /api/user/signup`: Create a new user account.


 -->

## Contributing

Contributions are welcome! Here's how you can get involved:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please make sure your code follows the project's [code style guidelines](#).

## Installation

### Prerequisites

Ensure that you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (v12.x or above)
- [MongoDB](https://www.mongodb.com/) (set up a local or cloud MongoDB instance)

### Steps to Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/AhmadYousif89/linkup.git
   cd linkup
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

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

4. Start the application:

   Start the backend server from backend directory:

   ```bash
   npm start
   ```

   Start the frontend server from client directory:

   ```bash
   npm run dev
   ```

5. Navigate to `http://localhost:5173` in your browser to start using the application.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
