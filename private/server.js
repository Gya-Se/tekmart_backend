const express = require("express");
const bodyParser = require("body-parser");
const dbConnect = require("../config/dbConnection");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 3001;
const authRouter = require("./route/auth.routes");
const { notFound, errorHandler } = require("./middlewares/customErrorHandler");
dbConnect();

//BODY PARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: false}));

//API CONNECTION
app.use("/api/user", authRouter)


//ERROR HANDLERS
app.use(notFound);
app.use(errorHandler);


//CREATING A PORTAL TO LISTEN FROM
app.listen(PORT, () => {
  console.log("App started on port", PORT);
});

