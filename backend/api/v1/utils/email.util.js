import nodemailer from "nodemailer";

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.NODEMAILER_GOOGLE_APP_KEY
    }
}); 

let nodemailerStatus = await transporter.verify();
console.log("NODEMAILER STATUS:", nodemailerStatus);

const sendMail = async (to, subject, text = null, html = null) => {

    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to,
        subject,
        text,
        html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

export const sendRegisterEmail = async (to, text, accountVerificationToken) => {

    const html = `<div style="font-family: Arial, sans-serif; text-align: center;">
                <h2>Welcome!</h2>
                <p>Click the button below to verify your account:</p>
                <a href="${process.env.FRONTEND_URL}/verify-acoount/${accountVerificationToken}" style="background-color:#4CAF50;color:white;padding:12px 20px;text-decoration:none;border-radius:5px;display:inline-block;margin-top:20px;">
                    Verify Account
                </a>
                </div>`

    sendMail(to, "Welcome", text, html);
}