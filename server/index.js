import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userrouter from './routes/auth.js';
import connectDB from './config/db.js';


const app = express();
const PORT = process.env.PORT || 3000;
connectDB();
// app.use(cors());

app.use(cors({
    origin: "http://localhost:5173", // Adjust the origin as needed
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Expires', 'Pragma'],
}))
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.use("/auth", userrouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;