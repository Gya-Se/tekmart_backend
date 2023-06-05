const { notFound, errorHandler } = require("./middlewares/customErrorHandler");
const dbConnect = require("./config/dbConnection");
const dotenv = require("dotenv");
dotenv.config();

//EXPORTING ROUTES
const vendorRouter = require("./route/vendor.routes");
const userRouter = require("./route/user.routes");
const adminRouter = require("./route/admin.routes")
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const express = require("express");
const morgan = require("morgan");
const app = express();
dbConnect();

//PARSERs
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: false}));
app.use(cookieParser());

//API CONNECTIONS
app.use("/v1/api/user", userRouter);
app.use("/v1/api/vendor", vendorRouter);
app.use("/v1/api/admin", adminRouter);

//ERROR HANDLERS
app.use(notFound);
app.use(errorHandler);

//CREATING A PORTAL TO LISTEN FROM
app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});

