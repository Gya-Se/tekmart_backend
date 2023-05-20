const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbConnection");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 3001;
const authRouter = require("./route/auth.routes");
const productRouter = require("./route/product.routes");
const blogRouter = require("./route/blog.routes");
const categoryRouter = require("./route/category.routes");
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
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/coupon", couponRouter);

//ERROR HANDLERS
app.use(notFound);
app.use(errorHandler);

//CREATING A PORTAL TO LISTEN FROM
app.listen(PORT, () => {
  console.log("App started on port", PORT);
});

