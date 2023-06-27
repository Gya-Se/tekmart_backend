const { notFound, errorHandler } = require("./middlewares/customErrorHandler");
const dbConnect = require("./config/dbConnection");
const dotenv = require("dotenv");
dotenv.config();

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
app.use(cors());

//Api connections
app.use("/v1/api/user", userRouter);
app.use("/v1/api/vendor", vendorRouter);
app.use("/v1/api/admin", adminRouter);
app.use("/v1/api/product", productRouter);
app.use("/v1/api/transaction", transactionRouter);
app.use("/v1/api/withdraw", withdrawRouter);
app.use("/v1/api/order", orderRouter);
app.use("/v1/api/cart", cartRouter);

//Error handlers
app.use(notFound);
app.use(errorHandler);

//Connecting to database
dbConnect();


//Creating a portal  to listen from
app.get('/', (req, res) => res.json("Server works!"))

//Creating a portal  to listen from
  app.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`);
  })
