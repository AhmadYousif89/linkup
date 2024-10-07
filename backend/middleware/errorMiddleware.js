/* eslint-disable no-unused-vars */
class AppHandlers {
  // If url not found
  static urlNotFound = (req, res, next) => {
    res.status(404);
    const error = new Error(`${req.originalUrl} Not Found`);
    next(error);
  };

  // Incase of any unknown error
  static errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const message = err.message || 'Internal Server Error';
    console.log(message);
    res.status(statusCode).json({ message });
  };
}

export default AppHandlers;
