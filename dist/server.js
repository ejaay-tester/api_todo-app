"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const json_server_1 = __importDefault(require("json-server"));
// Creates Express app instances
const app = (0, express_1.default)();
const router = json_server_1.default.router("db.json"); // Creates router based on db.json
const middlewares = json_server_1.default.defaults(); // Adds default JSON Server middlewares, logger, CORS, static, no-cache
// Applies JSON Server default middleware
// This already includes body parsing behavior
app.use(middlewares);
// AUTHENTICATION MIDDLEWARE --> app.use((req,res,next) => {})
// Custom middleware runs before router
app.use((req, res, next) => {
    if (req.method !== "GET") {
        const authHeader = req.headers.authorization; // Reads Authorization header
        if (!authHeader || authHeader !== "Bearer mysecrettoken") {
            // Checks if header is missing OR token is incorrect
            // If invalid, return 401
            return res.status(401).json({
                errorCode: "UNAUTHORIZED",
                message: "Invalid or missing token",
            });
        }
    }
    // If valid -> proceed to router
    next();
});
// Attach JSON Server routes after auth check
app.use(router);
// Use Render's port if deployed, otherwise 3001 locally
const PORT = Number(process.env.PORT) || 3001;
// Start server, bind to 0.0.0.0 for cloud compatibility
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map