import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendWelcomeEmail = async (email, username) => {
  try {
    const transporter = createTransporter();

    const welcomeHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Library Management System</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
            }
            .header h1 {
                font-size: 28px;
                margin-bottom: 10px;
            }
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            .content {
                padding: 40px 30px;
            }
            .welcome-message {
                text-align: center;
                margin-bottom: 30px;
            }
            .welcome-message h2 {
                color: #667eea;
                font-size: 24px;
                margin-bottom: 15px;
            }
            .welcome-message p {
                font-size: 16px;
                color: #666;
                line-height: 1.8;
            }
            .features {
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 25px;
                margin: 30px 0;
            }
            .features h3 {
                color: #333;
                margin-bottom: 20px;
                text-align: center;
            }
            .feature-list {
                list-style: none;
            }
            .feature-list li {
                padding: 8px 0;
                border-bottom: 1px solid #e9ecef;
                position: relative;
                padding-left: 25px;
            }
            .feature-list li:before {
                content: "✓";
                color: #28a745;
                font-weight: bold;
                position: absolute;
                left: 0;
            }
            .feature-list li:last-child {
                border-bottom: none;
            }
            .cta-button {
                display: block;
                width: 200px;
                margin: 30px auto;
                padding: 12px 24px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 25px;
                text-align: center;
                font-weight: bold;
                transition: transform 0.3s ease;
            }
            .cta-button:hover {
                transform: translateY(-2px);
            }
            .footer {
                background-color: #f8f9fa;
                padding: 25px;
                text-align: center;
                border-top: 1px solid #e9ecef;
            }
            .footer p {
                color: #666;
                font-size: 14px;
                margin-bottom: 10px;
            }
            .social-links {
                margin-top: 15px;
            }
            .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #667eea;
                text-decoration: none;
            }
            @media (max-width: 600px) {
                .content {
                    padding: 20px;
                }
                .header {
                    padding: 30px 20px;
                }
                .header h1 {
                    font-size: 24px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📚 Library Management System</h1>
                <p>Your gateway to knowledge and learning</p>
            </div>
            
            <div class="content">
                <div class="welcome-message">
                    <h2>Welcome aboard, ${username}! 🎉</h2>
                    <p>We're thrilled to have you join our library community. Your account has been successfully created and you're now ready to explore thousands of books, resources, and digital content.</p>
                </div>

                <div class="features">
                    <h3>What you can do now:</h3>
                    <ul class="feature-list">
                        <li>Browse our extensive collection of books and digital resources</li>
                        <li>Reserve books and get notified when they're available</li>
                        <li>Track your reading history and set reading goals</li>
                        <li>Access digital books and audiobooks 24/7</li>
                        <li>Get personalized book recommendations</li>
                        <li>Participate in library events and book clubs</li>
                        <li>Manage your account and preferences</li>
                    </ul>
                </div>

                <a href="http://localhost:3000" class="cta-button">Start Exploring</a>

                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #666; font-size: 14px;">
                        <strong>Need help?</strong><br>
                        Our library staff is here to assist you. Contact us at 
                        <a href="mailto:support@library.com" style="color: #667eea;">support@library.com</a>
                        or visit our help center.
                    </p>
                </div>
            </div>

            <div class="footer">
                <p><strong>Happy Reading!</strong></p>
                <p>The Library Management Team</p>
                <div class="social-links">
                    <a href="#">📧 Email</a>
                    <a href="#">🌐 Website</a>
                    <a href="#">📱 Mobile App</a>
                </div>
                <p style="margin-top: 15px; font-size: 12px; color: #999;">
                    This email was sent to ${email}. If you didn't create an account, please contact us.
                </p>
            </div>
        </div>
    </body>
    </html>`;

    const mailOptions = {
      from: `"Library Management System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Welcome to Library Management System!",
      html: welcomeHtml,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}:`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (err) {
    console.error("❌ Error sending welcome email:", err.message);
    return { success: false, error: err.message };
  }
};

export const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();

    const resetHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
            }
            .header h1 {
                font-size: 28px;
                margin-bottom: 10px;
            }
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            .content {
                padding: 40px 30px;
            }
            .alert-box {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 30px;
                text-align: center;
            }
            .alert-box .icon {
                font-size: 48px;
                margin-bottom: 15px;
            }
            .alert-box h2 {
                color: #856404;
                margin-bottom: 10px;
            }
            .alert-box p {
                color: #856404;
                font-size: 14px;
            }
            .reset-section {
                text-align: center;
                margin: 30px 0;
            }
            .reset-section h3 {
                color: #333;
                margin-bottom: 15px;
            }
            .reset-section p {
                color: #666;
                margin-bottom: 25px;
                line-height: 1.8;
            }
            .token-box {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border: 2px dashed #6c757d;
                border-radius: 8px;
                padding: 20px;
                margin: 25px 0;
                text-align: center;
            }
            .token {
                font-family: 'Courier New', monospace;
                font-size: 24px;
                font-weight: bold;
                color: #495057;
                letter-spacing: 2px;
                word-break: break-all;
                background-color: #fff;
                padding: 15px;
                border-radius: 5px;
                border: 1px solid #dee2e6;
                margin: 10px 0;
            }
            .copy-instruction {
                font-size: 12px;
                color: #6c757d;
                margin-top: 10px;
            }
            .cta-button {
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
                color: white;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                margin: 20px 0;
                transition: transform 0.3s ease;
            }
            .cta-button:hover {
                transform: translateY(-2px);
            }
            .security-notice {
                background-color: #f8f9fa;
                border-left: 4px solid #ff6b6b;
                padding: 20px;
                margin: 30px 0;
                border-radius: 0 8px 8px 0;
            }
            .security-notice h4 {
                color: #ff6b6b;
                margin-bottom: 10px;
            }
            .security-notice ul {
                color: #666;
                padding-left: 20px;
            }
            .security-notice li {
                margin-bottom: 5px;
            }
            .expiry-notice {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 15px;
                text-align: center;
                margin: 20px 0;
            }
            .expiry-notice strong {
                color: #856404;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 25px;
                text-align: center;
                border-top: 1px solid #e9ecef;
            }
            .footer p {
                color: #666;
                font-size: 14px;
                margin-bottom: 10px;
            }
            @media (max-width: 600px) {
                .content {
                    padding: 20px;
                }
                .header {
                    padding: 30px 20px;
                }
                .header h1 {
                    font-size: 24px;
                }
                .token {
                    font-size: 18px;
                    letter-spacing: 1px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Password Reset Request</h1>
                <p>Library Management System</p>
            </div>
            
            <div class="content">
                <div class="alert-box">
                    <div class="icon">⚠️</div>
                    <h2>Password Reset Requested</h2>
                    <p>Someone has requested a password reset for your account</p>
                </div>

                <div class="reset-section">
                    <h3>Your Password Reset Token</h3>
                    <p>Use the token below to reset your password. Copy this token and paste it in the CLI application when prompted.</p>
                    
                    <div class="token-box">
                        <div class="token">${resetToken}</div>
                        <div class="copy-instruction">Click to select and copy the token above</div>
                    </div>
                </div>

                <div class="expiry-notice">
                    <strong>⏰ Important:</strong> This token will expire in 15 minutes for security reasons.
                </div>

                <div class="security-notice">
                    <h4>🛡️ Security Guidelines</h4>
                    <ul>
                        <li>Never share this token with anyone</li>
                        <li>Use this token only in the official CLI application</li>
                        <li>If you didn't request this reset, please contact support immediately</li>
                        <li>This token can only be used once</li>
                        <li>Make sure to create a strong new password</li>
                    </ul>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #666;">
                        <strong>Need help?</strong><br>
                        Contact our support team at 
                        <a href="mailto:support@library.com" style="color: #ff6b6b;">support@library.com</a>
                    </p>
                </div>
            </div>

            <div class="footer">
                <p><strong>Library Management System</strong></p>
                <p>This email was sent to ${email}</p>
                <p style="margin-top: 15px; font-size: 12px; color: #999;">
                    If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                </p>
            </div>
        </div>
    </body>
    </html>`;

    const mailOptions = {
      from: `"Library Management System Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Password Reset Token - Action Required",
      html: resetHtml,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Reset token sent to ${email}:`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (err) {
    console.error("❌ Error sending token email:", err.message);
    return { success: false, error: err.message };
  }
};

export const sendEmailVerificationToken = async (email, verificationToken) => {
  try {
    const transporter = createTransporter();

    const verificationHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email Address</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
            }
            .header h1 {
                font-size: 28px;
                margin-bottom: 10px;
            }
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            .content {
                padding: 40px 30px;
            }
            .verification-box {
                background-color: #d1ecf1;
                border: 1px solid #bee5eb;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 30px;
                text-align: center;
            }
            .verification-box .icon {
                font-size: 48px;
                margin-bottom: 15px;
            }
            .verification-box h2 {
                color: #0c5460;
                margin-bottom: 10px;
            }
            .verification-box p {
                color: #0c5460;
                font-size: 14px;
            }
            .verification-section {
                text-align: center;
                margin: 30px 0;
            }
            .verification-section h3 {
                color: #333;
                margin-bottom: 15px;
            }
            .verification-section p {
                color: #666;
                margin-bottom: 25px;
                line-height: 1.8;
            }
            .token-box {
                background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
                border: 2px dashed #28a745;
                border-radius: 8px;
                padding: 20px;
                margin: 25px 0;
                text-align: center;
            }
            .token {
                font-family: 'Courier New', monospace;
                font-size: 24px;
                font-weight: bold;
                color: #155724;
                letter-spacing: 2px;
                word-break: break-all;
                background-color: #fff;
                padding: 15px;
                border-radius: 5px;
                border: 1px solid #c3e6cb;
                margin: 10px 0;
            }
            .copy-instruction {
                font-size: 12px;
                color: #155724;
                margin-top: 10px;
            }
            .cta-button {
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                color: white;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                margin: 20px 0;
                transition: transform 0.3s ease;
            }
            .cta-button:hover {
                transform: translateY(-2px);
            }
            .verification-steps {
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 25px;
                margin: 30px 0;
            }
            .verification-steps h4 {
                color: #28a745;
                margin-bottom: 15px;
                text-align: center;
            }
            .steps-list {
                list-style: none;
                counter-reset: step-counter;
            }
            .steps-list li {
                counter-increment: step-counter;
                padding: 10px 0;
                position: relative;
                padding-left: 40px;
            }
            .steps-list li:before {
                content: counter(step-counter);
                position: absolute;
                left: 0;
                top: 10px;
                background: #28a745;
                color: white;
                width: 25px;
                height: 25px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
            }
            .expiry-notice {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 15px;
                text-align: center;
                margin: 20px 0;
            }
            .expiry-notice strong {
                color: #856404;
            }
            .benefits-box {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-left: 4px solid #28a745;
                padding: 20px;
                margin: 30px 0;
                border-radius: 0 8px 8px 0;
            }
            .benefits-box h4 {
                color: #28a745;
                margin-bottom: 15px;
            }
            .benefits-list {
                list-style: none;
                color: #666;
            }
            .benefits-list li {
                margin-bottom: 8px;
                position: relative;
                padding-left: 25px;
            }
            .benefits-list li:before {
                content: "✓";
                color: #28a745;
                font-weight: bold;
                position: absolute;
                left: 0;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 25px;
                text-align: center;
                border-top: 1px solid #e9ecef;
            }
            .footer p {
                color: #666;
                font-size: 14px;
                margin-bottom: 10px;
            }
            @media (max-width: 600px) {
                .content {
                    padding: 20px;
                }
                .header {
                    padding: 30px 20px;
                }
                .header h1 {
                    font-size: 24px;
                }
                .token {
                    font-size: 18px;
                    letter-spacing: 1px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📧 Verify Your Email</h1>
                <p>Library Management System</p>
            </div>
            
            <div class="content">
                <div class="verification-box">
                    <div class="icon">✉️</div>
                    <h2>Email Verification Required</h2>
                    <p>Please verify your email address to activate your account</p>
                </div>

                <div class="verification-section">
                    <h3>Your Email Verification Token</h3>
                    <p>Use the token below to verify your email address. Copy this token and paste it in the CLI application when prompted.</p>
                    
                    <div class="token-box">
                        <div class="token">${verificationToken}</div>
                        <div class="copy-instruction">Click to select and copy the token above</div>
                    </div>
                </div>

                <div class="expiry-notice">
                    <strong>⏰ Important:</strong> This verification token will expire in 24 hours.
                </div>

                <div class="verification-steps">
                    <h4>📋 How to Verify Your Email</h4>
                    <ol class="steps-list">
                        <li>Copy the verification token above</li>
                        <li>Open the Library Management CLI application</li>
                        <li>Select "Verify Email" from the menu</li>
                        <li>Paste the token when prompted</li>
                        <li>Your email will be verified instantly!</li>
                    </ol>
                </div>

                <div class="benefits-box">
                    <h4>🎯 Benefits of Email Verification</h4>
                    <ul class="benefits-list">
                        <li>Secure your account with verified contact information</li>
                        <li>Receive important notifications about your library activities</li>
                        <li>Get instant alerts for book availability and due dates</li>
                        <li>Access password reset and account recovery features</li>
                        <li>Receive personalized book recommendations via email</li>
                        <li>Stay updated with library events and announcements</li>
                    </ul>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #666;">
                        <strong>Need help?</strong><br>
                        Contact our support team at 
                        <a href="mailto:support@library.com" style="color: #28a745;">support@library.com</a>
                    </p>
                </div>
            </div>

            <div class="footer">
                <p><strong>Library Management System</strong></p>
                <p>This verification email was sent to ${email}</p>
                <p style="margin-top: 15px; font-size: 12px; color: #999;">
                    If you didn't create an account, please ignore this email or contact support if you have concerns.
                </p>
            </div>
        </div>
    </body>
    </html>`;

    const mailOptions = {
      from: `"Library Management System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "📧 Verify Your Email Address - Library Management System",
      html: verificationHtml,
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email verification token sent to ${email}:`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (err) {
    console.error("❌ Error sending verification email:", err.message);
    return { success: false, error: err.message };
  }
};
