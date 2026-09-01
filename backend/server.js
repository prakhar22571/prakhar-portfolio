import app from "./app.js";
import { dbConnection } from "./database/connection.js";

// Local / long-running (non-serverless) entry point.
const PORT = process.env.PORT || 4000;

dbConnection().catch((err) => {
  console.log("Some error occurred while connecting to database:", err);
});

app.listen(PORT, () => {
  console.log(`Server listening at Port ${PORT}`);
});
