import "dotenv/config"; // This executes config immediately upon import
import app from "./app.js";
import connectDB from "./db/db.js";

connectDB();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
