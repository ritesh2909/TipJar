const express = require("express");
const { dbSetup } = require("./config/mongoDb");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth.route");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./swagger.json");

// env setup
dotenv.config();

// db connection
dbSetup();

const server = express();

server.use(express.json());
server.use(cors());

// Serve Swagger UI at /api-docs
server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

// implementing routes
server.use("/api/auth", authRoute.router);

server.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
