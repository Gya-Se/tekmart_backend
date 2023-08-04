const { notFound, errorHandler } = require("./middlewares/customErrorHandler");
const dbConnect = require("./config/dbConnection");

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "./.env",
  });
}

//Exporting routes
const vendorRouter = require("./route/vendor.routes");
const userRouter = require("./route/user.routes");
const adminRouter = require("./route/admin.routes")
const productRouter = require("./route/product.routes");
const cartRouter = require("./route/cart.routes");
const transactionRouter = require("./route/transaction.routes");
const withdrawRouter = require("./route/withdraw.routes");
const orderRouter = require("./route/order.routes");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

//Parsers
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(
  {
    origin: ["http://localhost:3000", "https://tekmart-frontend.vercel.app"],
    optionsSuccessStatus: 200,
    credentials: true,
  }
));

//Api connections
app.use("/api/v1/user", userRouter);
app.use("/api/v1/vendor", vendorRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/transaction", transactionRouter);
app.use("/api/v1/withdraw", withdrawRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/cart", cartRouter);

//Error handlers
app.use(notFound);
app.use(errorHandler);

//Connecting to database
dbConnect();


//Creating a portal  to listen from
app.get('/', (req, res) => {
  res.send({ message: "Server works!" })
})

//Creating a portal  to listen from
app.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`);
})
