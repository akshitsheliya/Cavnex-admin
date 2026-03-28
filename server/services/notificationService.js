const nodemailer = require("nodemailer");
const dns = require("dns");

// ✅ FORCE IPv4 at DNS level
dns.setDefaultResultOrder("ipv4first");

// Create reusable transporter with IPv4
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com", // ✅ Hardcoded to avoid env issues
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    family: 4, // ✅ FORCE IPv4
    connectionTimeout: 30000, // 30 seconds
    greetingTimeout: 30000,
    socketTimeout: 30000,
  });
};

// Send new lead notification email
const sendNewLeadNotification = async (leadData) => {
  console.log("📧 Starting email notification...");

  try {
    // Check if email config exists
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("⚠️ Email not configured");
      console.log("SMTP_USER:", process.env.SMTP_USER ? "SET" : "NOT SET");
      console.log("SMTP_PASS:", process.env.SMTP_PASS ? "SET" : "NOT SET");
      return { success: false, message: "Email not configured" };
    }

    console.log("📧 Creating transporter with IPv4...");
    const transporter = createTransporter();

    // Skip verify - sometimes it fails but send works
    console.log("📧 Sending email directly (skipping verify)...");

    const { name, email, phone, message, source, createdAt } = leadData;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Lead</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #1a1a1a; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #252525; border-radius: 10px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #00ff88, #00d4ff); padding: 20px; text-align: center;">
            <h1 style="margin: 0; color: #000;">🎉 New Lead!</h1>
          </div>
          <div style="padding: 20px; color: #fff;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #00d4ff;">${email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${phone}" style="color: #00d4ff;">${phone}</a></p>
            <p><strong>Source:</strong> ${source || "website-contact"}</p>
            <p><strong>Time:</strong> ${new Date(createdAt).toLocaleString("en-IN")}</p>
            <hr style="border-color: #444;">
            <p><strong>Message:</strong></p>
            <p style="background: #1a1a1a; padding: 15px; border-radius: 5px;">${message || "No message"}</p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://admin.cavnex.in/leads" style="background: #00ff88; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View in Admin</a>
              <a href="https://wa.me/91${phone}" style="background: #25D366; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-left: 10px;">WhatsApp</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"${process.env.FROM_NAME || "Cavnex Website"}" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER,
      subject: `🎯 New Lead: ${name}`,
      html: htmlContent,
      text: `New Lead: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message || "None"}`,
      replyTo: email,
    };

    console.log("📧 Sending to:", mailOptions.to);

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email error:", error.message);
    console.error("❌ Error code:", error.code);
    console.error("❌ Full error:", error);
    return { success: false, error: error.message };
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return { success: false, message: "Email credentials not configured" };
    }

    const transporter = createTransporter();
    await transporter.verify();
    return { success: true, message: "Email configuration is valid" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  sendNewLeadNotification,
  testEmailConfig,
};
