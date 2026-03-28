const nodemailer = require("nodemailer");

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Send new lead notification email
const sendNewLeadNotification = async (leadData) => {
  try {
    // Check if email config exists
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("⚠️ Email not configured, skipping notification");
      return { success: false, message: "Email not configured" };
    }

    const transporter = createTransporter();

    // Verify connection
    await transporter.verify();
    console.log("✅ SMTP connection verified");

    const { name, email, phone, message, source, createdAt } = leadData;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Lead Notification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="margin: 0; color: #000; font-size: 24px; font-weight: 700;">🎉 New Lead Received!</h1>
            <p style="margin: 10px 0 0; color: #000; opacity: 0.8;">Website Contact Form Submission</p>
          </div>
          
          <!-- Content -->
          <div style="background-color: #1a1a1a; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #333; border-top: none;">
            <!-- Lead Info Card -->
            <div style="background-color: #252525; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #333;">
              <h2 style="margin: 0 0 20px; color: #00ff88; font-size: 18px;">📋 Lead Details</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #888; width: 120px; vertical-align: top;">Name:</td>
                  <td style="padding: 10px 0; color: #fff; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888; vertical-align: top;">Email:</td>
                  <td style="padding: 10px 0;">
                    <a href="mailto:${email}" style="color: #00d4ff; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888; vertical-align: top;">Phone:</td>
                  <td style="padding: 10px 0;">
                    <a href="tel:${phone}" style="color: #00d4ff; text-decoration: none;">${phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888; vertical-align: top;">Source:</td>
                  <td style="padding: 10px 0;">
                    <span style="background: linear-gradient(135deg, #00ff88, #00d4ff); color: #000; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                      ${source || "website-contact"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888; vertical-align: top;">Received:</td>
                  <td style="padding: 10px 0; color: #fff;">${new Date(
                    createdAt
                  ).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}</td>
                </tr>
              </table>
            </div>
            
            <!-- Message Box -->
            <div style="background-color: #252525; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #333;">
              <h3 style="margin: 0 0 15px; color: #00ff88; font-size: 16px;">💬 Message</h3>
              <p style="margin: 0; color: #ddd; line-height: 1.6; white-space: pre-wrap;">${message || "No message provided"}</p>
            </div>
            
            <!-- Quick Actions -->
            <div style="text-align: center; margin-top: 25px;">
              <a href="https://admin.cavnex.in/leads" 
                 style="display: inline-block; background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%); color: #000; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 5px;">
                📊 View in Admin Panel
              </a>
              <a href="mailto:${email}" 
                 style="display: inline-block; background-color: #333; color: #fff; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 5px; border: 1px solid #444;">
                ✉️ Reply to Lead
              </a>
            </div>
            
            <!-- WhatsApp Link -->
            <div style="text-align: center; margin-top: 15px;">
              <a href="https://wa.me/91${phone}" 
                 style="display: inline-block; background-color: #25D366; color: #fff; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                📱 WhatsApp
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p style="margin: 0;">This is an automated notification from Cavnex Admin System</p>
            <p style="margin: 5px 0 0;">© ${new Date().getFullYear()} Cavnex Infotech. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
New Lead Received!
==================

Name: ${name}
Email: ${email}
Phone: ${phone}
Source: ${source || "website-contact"}
Received: ${new Date(createdAt).toLocaleString("en-IN")}

Message:
${message || "No message provided"}

---
View in Admin Panel: https://admin.cavnex.in/leads
Reply: mailto:${email}
WhatsApp: https://wa.me/91${phone}

This is an automated notification from Cavnex Admin System.
    `;

    const mailOptions = {
      from: `"${process.env.FROM_NAME || "Cavnex Website"}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER,
      subject: `🎯 New Lead: ${name} - Cavnex Website`,
      text: textContent,
      html: htmlContent,
      replyTo: email,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Notification email sent:", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send notification email:", error.message);
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
