const { Resend } = require("resend");

const sendNewLeadNotification = async (leadData) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { success: false, message: "Email service not configured" };
    }

    const { name, email, phone, message, source, createdAt } = leadData;

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Format date nicely
    const formattedDate = new Date(createdAt).toLocaleString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>New Lead Notification</title>
        <!--[if mso]>
        <style type="text/css">
          body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
        </style>
        <![endif]-->
      </head>
      <body style="margin: 0; padding: 0; background-color: #0f0f0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        
        <!-- Email Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0f0f0f; padding: 20px 0;">
          <tr>
            <td align="center">
              
              <!-- Main Content -->
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #1a1a1a; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 255, 136, 0.1);">
                
                <!-- Header with Gradient -->
                <tr>
                  <td style="background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%); padding: 40px 30px; text-align: center; position: relative;">
                    <div style="background: rgba(0, 0, 0, 0.1); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                      <span style="font-size: 48px;">🎯</span>
                    </div>
                    <h1 style="margin: 0; color: #000; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">New Lead Alert!</h1>
                    <p style="margin: 10px 0 0; color: #000; opacity: 0.8; font-size: 14px; font-weight: 500;">Someone is interested in your services</p>
                  </td>
                </tr>

                <!-- Lead Info Card -->
                <tr>
                  <td style="padding: 30px;">
                    
                    <!-- Name Badge -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 25px;">
                      <tr>
                        <td style="background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%); padding: 20px; border-radius: 16px; text-align: center;">
                          <p style="margin: 0; color: #000; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7;">Lead Name</p>
                          <h2 style="margin: 8px 0 0; color: #000; font-size: 24px; font-weight: 800;">${name}</h2>
                        </td>
                      </tr>
                    </table>

                    <!-- Contact Details Grid -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 25px;">
                      <tr>
                        <!-- Email -->
                        <td width="48%" style="background-color: #252525; padding: 20px; border-radius: 12px; vertical-align: top;">
                          <p style="margin: 0 0 8px; color: #888; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">📧 Email</p>
                          <a href="mailto:${email}" style="color: #00d4ff; text-decoration: none; font-size: 13px; word-break: break-all; font-weight: 500;">${email}</a>
                        </td>
                        <td width="4%"></td>
                        <!-- Phone -->
                        <td width="48%" style="background-color: #252525; padding: 20px; border-radius: 12px; vertical-align: top;">
                          <p style="margin: 0 0 8px; color: #888; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">📱 Phone</p>
                          <a href="tel:+91${phone}" style="color: #00ff88; text-decoration: none; font-size: 14px; font-weight: 600;">+91 ${phone}</a>
                        </td>
                      </tr>
                    </table>

                    <!-- Source & Time -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 25px;">
                      <tr>
                        <td style="background-color: #252525; padding: 20px; border-radius: 12px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="50%" style="vertical-align: top; padding-right: 10px;">
                                <p style="margin: 0 0 5px; color: #888; font-size: 11px; font-weight: 600; text-transform: uppercase;">Source</p>
                                <span style="display: inline-block; background: linear-gradient(135deg, #00ff88, #00d4ff); color: #000; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                                  ${source || "Website Contact"}
                                </span>
                              </td>
                              <td width="50%" style="vertical-align: top; padding-left: 10px;">
                                <p style="margin: 0 0 5px; color: #888; font-size: 11px; font-weight: 600; text-transform: uppercase;">Received</p>
                                <p style="margin: 0; color: #fff; font-size: 13px; font-weight: 500;">${formattedDate}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Message Box -->
                    ${
                      message
                        ? `
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 25px;">
                      <tr>
                        <td style="background-color: #252525; padding: 20px; border-radius: 12px; border-left: 4px solid #00ff88;">
                          <p style="margin: 0 0 12px; color: #00ff88; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">💬 Message</p>
                          <p style="margin: 0; color: #e0e0e0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </td>
                      </tr>
                    </table>
                    `
                        : ""
                    }

                    <!-- Action Buttons -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 15px;">
                      <tr>
                        <td align="center" style="padding: 10px 0;">
                          <a href="https://admin.cavnex.in/leads" style="display: inline-block; background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%); color: #000; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(0, 255, 136, 0.3); margin: 5px;">
                            📊 Open Admin Panel
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding: 5px 0;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td>
                                <a href="mailto:${email}" style="display: inline-block; background-color: #2d2d2d; color: #fff; padding: 14px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 13px; margin: 5px; border: 1px solid #404040;">
                                  ✉️ Reply via Email
                                </a>
                              </td>
                              <td>
                                <a href="https://wa.me/91${phone}" style="display: inline-block; background-color: #25D366; color: #fff; padding: 14px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 13px; margin: 5px;">
                                  📱 WhatsApp Chat
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Tip Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 212, 255, 0.1)); padding: 15px 20px; border-radius: 10px; border-left: 3px solid #00ff88;">
                          <p style="margin: 0; color: #b0b0b0; font-size: 12px; line-height: 1.5;">
                            <strong style="color: #00ff88;">💡 Pro Tip:</strong> Respond within 5 minutes to increase conversion rate by 400%!
                          </p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #141414; padding: 25px 30px; text-align: center; border-top: 1px solid #2a2a2a;">
                    <p style="margin: 0 0 8px; color: #666; font-size: 11px; font-weight: 500;">
                      Automated notification from <strong style="color: #00ff88;">Cavnex Admin System</strong>
                    </p>
                    <p style="margin: 0; color: #555; font-size: 10px;">
                      © ${new Date().getFullYear()} Cavnex Infotech. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>

              <!-- Mobile Spacing -->
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; margin-top: 20px;">
                <tr>
                  <td style="padding: 0 20px; text-align: center;">
                    <p style="margin: 0; color: #555; font-size: 11px;">
                      This email was sent to ${process.env.NOTIFICATION_EMAIL || "cavnexstudio@gmail.com"}
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>

      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "Cavnex Website <contact@cavnex.in>",
      to: [process.env.NOTIFICATION_EMAIL || "cavnexstudio@gmail.com"],
      subject: `🎯 New Lead: ${name} - Cavnex Website`,
      html: htmlContent,
      replyTo: email,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      return { success: false, error: error.message };
    }

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
