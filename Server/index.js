import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import winston from "winston";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "your_secret_key";

// Mock database
const users = {}; // Example: { "user1": { passwordHash: "hash", watchlist: ["Movie1", "Movie2"] } }

// Configure Winston logger
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        new winston.transports.File({ filename: "app.log" }) // Log to file
    ]
});

// Middleware to log incoming requests
app.use((req, res, next) => {
    logger.info({
        message: "Incoming request",
        method: req.method,
        url: req.url,
        body: req.body,
        headers: req.headers
    });
    next();
});

// User login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!users[username]) {
        logger.warn(`Login failed for non-existing user: ${username}`);
        return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, users[username].passwordHash);
    if (!isMatch) {
        logger.warn(`Invalid login attempt for user: ${username}`);
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    logger.info(`User logged in: ${username}`);
    res.json({ token });
});

// User registration
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (users[username]) {
        logger.warn(`Registration attempt for already existing user: ${username}`);
        return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    users[username] = { passwordHash, watchlist: [] };
    logger.info(`New user registered: ${username}`);
    res.status(201).json({ message: "User registered successfully" });
});

// Add movie to watchlist
app.post("/addToWatchlist", (req, res) => {
    const { token, movie } = req.body;

    try {
        const { username } = jwt.verify(token, SECRET_KEY);
        users[username].watchlist.push(movie);
        logger.info(`Movie added to watchlist for user: ${username}`, { movie });
        res.json({ watchlist: users[username].watchlist });
    } catch (error) {
        logger.error("Invalid token during watchlist addition", { error });
        res.status(401).json({ message: "Invalid token" });
    }
});

// Get watchlist
app.get("/watchlist", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    try {
        const { username } = jwt.verify(token, SECRET_KEY);
        logger.info(`Fetched watchlist for user: ${username}`);
        res.json({ watchlist: users[username].watchlist });
    } catch (error) {
        logger.error("Invalid token during watchlist fetch", { error });
        res.status(401).json({ message: "Invalid token" });
    }
});

app.listen(5000, () => logger.info("App is running on port 5000"));