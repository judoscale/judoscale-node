function churnEmail({ name }) {
  const firstName = name ? name.split(' ')[0] : 'there'

  return {
    subject: "We're sorry to see you go",
    htmlBody: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background-color: #3b82f6; padding: 32px 40px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Judoscale</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #1a1a2e; font-size: 20px;">Hey ${firstName},</h2>
              <p style="margin: 0 0 16px; color: #51545e; font-size: 16px; line-height: 24px;">
                We noticed your Judoscale account has been canceled. We're sorry to see you go!
              </p>
              <p style="margin: 0 0 16px; color: #51545e; font-size: 16px; line-height: 24px;">
                If there's anything we could have done better, we'd love to hear about it. Your feedback helps us improve for everyone.
              </p>
              <p style="margin: 0 0 16px; color: #51545e; font-size: 16px; line-height: 24px;">
                If you change your mind, you can always reactivate your account. We'll be here.
              </p>
              <p style="margin: 0 0 24px; color: #51545e; font-size: 16px; line-height: 24px;">
                Just reply to this email if there's anything you'd like to share.
              </p>
              <p style="margin: 0; color: #51545e; font-size: 16px; line-height: 24px;">
                — The Judoscale Team
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background-color: #f4f4f7; text-align: center;">
              <p style="margin: 0; color: #9a9ea6; font-size: 13px;">Judoscale, Inc.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  }
}

module.exports = churnEmail
