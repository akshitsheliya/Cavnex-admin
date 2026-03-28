const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendNewLeadNotification = async (leadData) => {
  console.log("📧 Starting email notification with Resend...");

  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("⚠️ RESEND_API_KEY not configured");
      return { success: false, message: "Email service not configured" };
    }

    const { name, email, phone, message, source, createdAt } = leadData;

    console.log(
      "📧 Sending email to:",
      process.env.NOTIFICATION_EMAIL || "cavnexstudio@gmail.com"
    );

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Lead Notification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="margin: 0; color: #000; font-size: 24px; font-weight: 700;">🎉 New Lead Received!</h1>
            <p style="margin: 10px 0 0; color: #000; opacity: 0.8;">Website Contact Form</p>
          </div>
          
          <div style="background-color: #1a1a1a; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #333;">
            <div style="background-color: #252525; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
              <h2 style="margin: 0 0 20px; color: #00ff88; font-size: 18px;">📋 Lead Details</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #888; width: 120px;">Name:</td>
                  <td style="padding: 10px 0; color: #fff; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888;">Email:</td>
                  <td style="padding: 10px 0;">
                    <a href="mailto:${email}" style="color: #00d4ff; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888;">Phone:</td>
                  <td style="padding: 10px 0;">
                    <a href="tel:+91${phone}" style="color: #00d4ff; text-decoration: none;">+91 ${phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888;">Source:</td>
                  <td style="padding: 10px 0;">
                    <span style="background: linear-gradient(135deg, #00ff88, #00d4ff); color: #000; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                      ${source || "website-contact"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888;">Time:</td>
                  <td style="padding: 10px 0; color: #fff;">${new Date(
                    createdAt
                  ).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #252525; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 15px; color: #00ff88; font-size: 16px;">💬 Message</h3>
              <p style="margin: 0; color: #ddd; line-height: 1.6; white-space: pre-wrap;">${message || "No message provided"}</p>
            </div>
            
            <div style="text-align: center; margin-top: 25px;">
              <a href="https://admin.cavnex.in/leads" 
                 style="display: inline-block; background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%); color: #000; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 5px;">
                📊 View in Admin Panel
              </a>
              <a href="mailto:${email}" 
                 style="display: inline-block; background-color: #333; color: #fff; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 5px;">
                ✉️ Reply
              </a>
            </div>
            
            <div style="text-align: center; margin-top: 15px;">
              <a href="https://wa.me/91${phone}" 
                 style="display: inline-block; background-color: #25D366; color: #fff; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                📱 WhatsApp
              </a>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p style="margin: 0;">Automated notification from Cavnex Admin</p>
            <p style="margin: 5px 0 0;">© ${new Date().getFullYear()} Cavnex Infotech</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // ✅ FIXED: Proper await and response handling
    const { data, error } = await resend.emails.send({
      from: `${process.env.FROM_NAME || "Cavnex Website"} <onboarding@resend.dev>`,
      to: [process.env.NOTIFICATION_EMAIL || "cavnexstudio@gmail.com"],
      subject: `🎯 New Lead: ${name} - Cavnex Website`,
      html: htmlContent,
      replyTo: email,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ Email sent successfully via Resend:", data?.id || data);

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("❌ Resend email error:", error.message);
    console.error("❌ Full error:", error);
    return { success: false, error: error.message };
  }
};

const testEmailConfig = async () => {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { success: false, message: "RESEND_API_KEY not configured" };
    }
    return { success: true, message: "Resend is configured" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  sendNewLeadNotification,
  testEmailConfig,
};
