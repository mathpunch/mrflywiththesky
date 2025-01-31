import rateLimit from "express-rate-limit";
import { setCookie } from "cookies-next";
import { v4 as uuidv4 } from "uuid";

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // 5 requests per minute
    message: { success: false, message: "Too many attempts. Try again later." }
});

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: "Method Not Allowed" });

    limiter(req, res, async () => {
        const { passcode } = req.body;
        const correctPasscode = process.env.PASSCODE || "12112";

        if (passcode === correctPasscode) {
            const sessionId = uuidv4(); // Unique session token
            setCookie("auth", sessionId, { req, res, httpOnly: true, secure: true, sameSite: "Strict", maxAge: 3600 });

            return res.status(200).json({ success: true });
        }

        return res.status(401).json({ success: false, message: "Incorrect passcode" });
    });
}
