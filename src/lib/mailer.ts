import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Gmail address
    pass: process.env.EMAIL_PASS, // App Password, not regular Gmail password
  },
});

export const sendConfirmationEmail = async (to: string, name: string) => {
  const mailOptions = {
    from: `"BookBazaar" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🎉 Welcome to BookBazaar!",
    html: `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h2>Hello ${name},</h2>
        <p>Welcome to <strong>BookBazaar</strong>! Your account has been created successfully.</p>
        <p>We’re thrilled to have you on board.</p>
        <br />
        <p>Happy reading! 📚</p>
        <p>— The BookBazaar Team</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Email sending failed");
  }
};
