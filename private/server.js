const express = require("express");
const bodyParser = require("body-parser");
const dbConnect = require("../database/mongodb");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 3001;
const authRouter = require("./route/authRoute");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: false}));

app.use("/api/user", authRouter)

app.use(notFound);
app.use(errorHandler);



app.listen(PORT, () => {
  console.log("App started on port", PORT);
});

