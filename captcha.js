import { v4 as uuidv4 } from "uuid";

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: "Method Not Allowed" });

    const { response } = req.body;
    const secret = process.env.CAPTCHA_SECRET;

    fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${response}`, {
        method: "POST"
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const captchaSession = uuidv4();
            res.setHeader('Set-Cookie', `captcha=${captchaSession}; HttpOnly; Secure; SameSite=Strict; Max-Age=600`);
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: "CAPTCHA verification failed." });
        }
    });
}
