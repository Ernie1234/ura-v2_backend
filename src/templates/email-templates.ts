export const verificationEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email Address</title>
  </head>
  <body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;">
    <table
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      role="presentation"
      style="background-color:#ffffff"
    >
      <tr>
        <td align="center" style="padding:40px 20px;">
          <!-- Card Container -->
          <table
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            role="presentation"
            style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;padding:40px 32px;box-shadow:0 2px 12px rgba(0,0,0,0.05);"
          >
            <!-- Logo -->
            <tr>
              <td align="left">
              <img
  src="https://res.cloudinary.com/dmgtg0sxj/image/upload/v1762417835/ura-removebg-preview_1_c9nf7s.png"
  alt="Ura Logo"
  width="48"
  height="48"
  style="display:block; border:none; outline:none; text-decoration:none;"
/>
              </td>
            </tr>

            <!-- Heading -->
            <tr>
              <td style="padding-top:32px;">
                <h1
                  style="font-size:28px;font-weight:700;color:#000;margin:0 0 8px 0;"
                >
                  ✨ Verify your email address
                </h1>
                <p
                  style="font-size:16px;line-height:26px;color:#666;margin:0;"
                >
                  To complete your registration, please verify your email by clicking the button below.
                </p>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td style="padding:32px 0;text-align:center;">
                <a
                  href="{verificationLink}"
                  style="background-color:#FF6363;color:#fff;text-decoration:none;font-size:16px;font-weight:600;padding:14px 36px;border-radius:8px;display:inline-block;"
                  target="_blank"
                >
                  Verify Email
                </a>
              </td>
            </tr>

            <!-- Code Box -->
            <tr>
              <td align="center">
                <div
                  style="background-color:#f8f8f8;border-radius:12px;padding:16px 24px;margin-top:12px;display:inline-block;"
                >
                  <p
                    style="margin:0;font-size:14px;color:#666;text-transform:uppercase;letter-spacing:1px;"
                  >
                    Verification Code
                  </p>
                  <p
                    style="margin:8px 0 0;font-size:32px;font-weight:700;color:#FF6363;letter-spacing:6px;font-family:'Courier New',monospace;"
                  >
                    {verificationCode}
                  </p>
                </div>
              </td>
            </tr>

            <!-- Footer Info -->
            <tr>
              <td style="padding-top:40px;">
                <p
                  style="font-size:14px;line-height:22px;color:#999;margin:0;text-align:center;"
                >
                  This code expires in 5 minutes. If you didn’t create an account, you can safely ignore this email.
                </p>

                <hr
                  style="margin:40px 0;border:none;border-top:1px solid #eaeaea;"
                />

                <p
                  style="font-size:12px;line-height:20px;color:#999;text-align:center;"
                >
                  © 2025 Ura Technologies. All rights reserved.<br />
                  This is an automated message, please do not reply.
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

export const passwordResetSuccessTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
<div style="background: linear-gradient(to right, #2196F3, #1976D2); padding: 20px; text-align: center;">
<h1 style="color: white; margin: 0;">Password Reset Successful</h1>
</div>
<div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
<p>Hello,</p>
<p>We're writing to confirm that your password has been successfully reset.</p>
<div style="text-align: center; margin: 30px 0;">
<div style="background-color: #2196F3; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
✓
</div>
</div>
<p>If you did not initiate this password reset, please contact our support team immediately.</p>
<p>For security reasons, we recommend that you:</p>
<ul>
<li>Use a strong, unique password</li>
<li>Enable two-factor authentication if available</li>
<li>Avoid using the same password across multiple sites</li>
</ul>
<p>Thank you for helping us keep your account secure.</p>
<p>Best regards,<br>Your App Team</p>
</div>
<div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
<p>This is an automated message, please do not reply to this email.</p>
</div>
</body>
</html>
`;

export const passwordResetRequestTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
<div style="background: linear-gradient(to right, #2196F3, #1976D2); padding: 20px; text-align: center;">
<h1 style="color: white; margin: 0;">Password Reset</h1>
</div>
<div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
<p>Hello,</p>
<p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
<p>To reset your password, click the button below:</p>
<div style="text-align: center; margin: 30px 0;">
<a href="{resetURL}" style="background-color: #2196F3; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
</div>
<p>This link will expire in 1 hour for security reasons.</p>
<p>Best regards,<br>Your App Team</p>
</div>
<div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
<p>This is an automated message, please do not reply to this email.</p>
</div>
</body>
</html>
`;

export const workspaceInvitationTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're Invited!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #2196F3, #1976D2); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">You're Invited to a Workspace!</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>You have been invited by <strong>{inviterName}</strong> to join the <strong>{workspaceName}</strong> workspace on Ura.</p>
    <p>Ura is a powerful tool for collaboration and project management. Join the workspace to start collaborating on tasks, projects, and more!</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{inviteURL}" style="background-color: #2196F3; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Join Workspace</a>
    </div>
    <p>If you're unable to click the button, you can copy and paste the following URL into your browser:</p>
    <p style="word-break: break-all; font-size: 0.9em; background-color: #eee; padding: 10px; border-radius: 5px;">{inviteURL}</p>
    <p>We look forward to seeing you there!</p>
    <p>Best regards,<br>Ura</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;
