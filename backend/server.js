import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get("/", (req, res) => {
  res.json({
    message: "Grace Invite API Running"
  });
});

app.listen(PORT, () => {
  console.log(`Grace Invite API listening on ${PORT}`);
});