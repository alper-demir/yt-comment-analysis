import nodemailer from "nodemailer";

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,  
    secure: true,  
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.NODEMAILER_GOOGLE_APP_KEY
    }
}); 

(async () => {
    try {
        const nodemailerStatus = await transporter.verify();
        console.log("✅ NODEMAILER STATUS: Ready to send emails");
    } catch (error) {
        console.error("❌ NODEMAILER CONFIG ERROR (App is still running):", error.message);
    }
})();

const sendMail = async (to, subject, text = null, html = null) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to,
        subject,
        text,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Email sending failed:', error);
    }
}

export const sendRegisterEmail = async (to, text, accountVerificationToken) => {
    const html = `<div style="font-family: Arial, sans-serif; text-align: center;">
                <h2>Welcome!</h2>
                <p>Click the button below to verify your account:</p>
                <a href="${process.env.FRONTEND_URL}/verify-account/${accountVerificationToken}" style="background-color:#4CAF50;color:white;padding:12px 20px;text-decoration:none;border-radius:5px;display:inline-block;margin-top:20px;">
                    Verify Account
                </a>
                </div>`

    // Fonksiyonun asenkron çalışmasını bozmamak için await ile çağırıyoruz
    await sendMail(to, "Welcome", text, html);
}
