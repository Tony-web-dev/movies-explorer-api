const { HTTP_STATUS_CREATED } = require('http2').constants;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../utils/errors/badRequestError');
const ConflictError = require('../utils/errors/conflictError');
const UnauthorizedError = require('../utils/errors/unauthorizedError');
const { SECRET_KEY } = require('../utils/constants');

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      const userRes = user.toObject();
      delete userRes.password;
      return res.status(HTTP_STATUS_CREATED).send(userRes);
    })
    .catch((error) => {
      if (error.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Проверьте правильность заполнения полей'));
      }
      return next(error);
    });
};

module.exports.editUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Проверьте правильность заполнения полей'));
      }
      return next(error);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? SECRET_KEY : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => next(new UnauthorizedError('Указаны неправильные почта или пароль')));
};
