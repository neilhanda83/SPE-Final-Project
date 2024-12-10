import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "your_secret_key";

// Mock database
const users = {}; // Example: { "user1": { passwordHash: "hash", watchlist: ["Movie1", "Movie2"] } }

// User login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!users[username]) {
        return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, users[username].passwordHash);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
});

// User registration
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (users[username]) {
        return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    users[username] = { passwordHash, watchlist: [] };
    res.status(201).json({ message: "User registered successfully" });
});

// Add movie to watchlist
app.post("/addToWatchlist", (req, res) => {
    const { token, movie } = req.body;

    try {
        const { username } = jwt.verify(token, SECRET_KEY);
        users[username].watchlist.push(movie);
        res.json({ watchlist: users[username].watchlist });
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
});

// Get watchlist
app.get("/watchlist", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    try {
        const { username } = jwt.verify(token, SECRET_KEY);
        res.json({ watchlist: users[username].watchlist });
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
});

app.listen(5000, () => console.log("App is running on port 5000"));