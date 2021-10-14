const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Жак-Ив Кусто",
    required: false,
    minlength: [2, "Слишком короткое имя"],
    maxlength: [30, "Слишком длинное имя"],
  },
  about: {
    type: String,
    default: "Исследователь",
    required: false,
    minlength: [2, "Слишком короткое описание"],
    maxlength: [30, "Слишком длинное описание"],
  },
  avatar: {
    type: String,
    default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    required: false,
    validate: {
      validator(link) {
        return validator.isUrl(link);
      },
      message: "Некорректный URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: "Некорректный email",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("Переданы некорректные данные");
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    throw new Error("Переданы некорректные данные");
  }

  return user;
};

module.exports = mongoose.model("user", userSchema);
