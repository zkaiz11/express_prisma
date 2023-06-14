const logger = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const createHttpError = require("http-errors");
const dotenv = require("dotenv").config();
const path = require('path');
const verifyToken = require("./middleware/verifyJWT");


const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/auth', require('./routes/authRoute'));

app.use(verifyToken);
app.use('/api/v1/password', require('./routes/passwordRoute'));
app.use('/api/v1/user', require('./routes/userRoute'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createHttpError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).json({'msg': err.message});
  // res.render("error");
});

app.listen(
    process.env.PORT,
    () => {
        console.log(`Server is up and running on ${process.env.PORT}`)
    }
)