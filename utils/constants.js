const SECRET_KEY = process.env.NODE_ENV === 'production' ? process.env.SECRET_KEY : 'dev-secret';
const {
  PORT = 3000,
  DataBaseURL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;
const urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

module.exports = {
  SECRET_KEY,
  PORT,
  DataBaseURL,
  urlRegex,
};
