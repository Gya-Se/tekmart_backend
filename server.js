const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbConnection");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 3001;
const userRouter = require("./route/user.routes");
const sellerRouter = require("./route/seller.routes");
const productRouter = require("./route/product.routes");
const couponRouter = require("./route/coupon.routes");
const { notFound, errorHandler } = require("./middlewares/customErrorHandler");
const morgan = require("morgan");
dbConnect();

//PARSERs
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: false}));
app.use(cookieParser());

//API CONNECTIONS
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/coupon", couponRouter);

//ERROR HANDLERS
app.use(notFound);
app.use(errorHandler);

//CREATING A PORTAL TO LISTEN FROM
app.listen(PORT, () => {
  console.log("App started on port", PORT);
});

