# LinkUp Realtime Chat Application

![hero image](/assets/hero.png)

LinkUp is a real-time chat application that allows users to create chat rooms and communicate with others in real-time. Users can create accounts, log in, add friends, create and join chat rooms, and share messages and media. The application is built using **React**, **Node.js**, **Express**, and **Socket.io**.

### Authors

[Malik Hussein](https://www.linkedin.com/in/malikhussein/)<br/>
[Mohamed Marzouk](https://www.linkedin.com/in/mohamed-marzouk-38aa75286/)<br/>
[Mahmoud Mohey Eldin](https://www.linkedin.com/in/moodyeg/)<br/>
[Ahmad Yousif](https://www.linkedin.com/in/dev-ahmadyousif/)<br/>

## The presentation

## Video Demo

## Features

- **User Authentication**: Create an account with email/password or social login (OAuth).
- **Real-time Messaging**: Chat with friends in real-time using WebSockets.
- **Friendship System**: Add friends and see who is online.
- **Chat Rooms**: Create and join chat rooms to communicate with groups.
- **Media Sharing**: Share messages and media (e.g., images, videos).
- **Push Notifications**: Get notified when friends send new messages (future feature).
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies

This project leverages modern technologies to deliver real-time communication:

- **Frontend**: [React](https://reactjs.org/) with state management and dynamic UI.
- **Backend**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) for RESTful APIs and routing.
- **Real-time Communication**: [Socket.io](https://socket.io/) for WebSocket-based real-time messaging.
- **Database**: [MongoDB](https://www.mongodb.com/) for storing user data, chats, and rooms.
- **Caching**: [Redis](https://redis.io/) for handling real-time data and improving performance.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for responsive and modern UI design.

## Usage

1. **Sign up/Login**: Create an account or log in with existing credentials.
2. **Add Friends**: Search for friends by username and send friend requests.
3. **Create/Join Chat Rooms**: Create a new chat room or join an existing one.
4. **Send Messages**: Chat in real-time with friends or group members. Share images, files, and other media.

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
- [Redis](https://redis.io/)

### Steps to Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/linkup-chat-app.git
   cd linkup-chat-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file and add the following variables:

   ```plaintext
    PORT=5000
    MONGO_URI=mongodb+srv://MoodyEG:or34nC5qwNdaVIu5@linkup.r1pmp.mongodb.net/?retryWrites=true&w=majority&appName=LinkUp
    JWT_SECRET=Bl7aFyElMzareta
   ```

4. Start the application:

   ```bash
   npm run start
   ```

   This will start the backend and the frontend together.

5. Navigate to `http://localhost:5000` in your browser to start using the application.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
