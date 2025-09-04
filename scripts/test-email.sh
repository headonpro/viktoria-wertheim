#!/bin/bash

# Test email configuration
# Usage: ./scripts/test-email.sh [recipient-email]

set -e

# Default recipient (can be overridden by command line argument)
TEST_RECIPIENT="${1:-admin@viktoria-wertheim.de}"

echo "Testing email configuration..."
echo ""

# Check if environment file exists
ENV_FILE=".env.local"
if [ ! -f "$ENV_FILE" ]; then
    ENV_FILE=".env.production"
    if [ ! -f "$ENV_FILE" ]; then
        echo "❌ ERROR: Neither .env.local nor .env.production found!"
        echo "Please configure your environment file first."
        exit 1
    fi
fi

echo "Using configuration from: $ENV_FILE"

# Extract email credentials
EMAIL_USER=$(grep "^EMAIL_USER=" $ENV_FILE | cut -d '=' -f2)
EMAIL_PASS=$(grep "^EMAIL_PASS=" $ENV_FILE | cut -d '=' -f2)

# Check if credentials are set
if [ -z "$EMAIL_USER" ] || [ -z "$EMAIL_PASS" ]; then
    echo "❌ ERROR: EMAIL_USER or EMAIL_PASS not configured in $ENV_FILE!"
    echo ""
    echo "Please configure your email credentials:"
    echo "1. For Gmail:"
    echo "   - Enable 2-factor authentication"
    echo "   - Generate app password at: https://myaccount.google.com/apppasswords"
    echo "   - Set EMAIL_USER to your Gmail address"
    echo "   - Set EMAIL_PASS to the generated app password"
    echo ""
    exit 1
fi

echo "Email configuration found:"
echo "  From: $EMAIL_USER"
echo "  To: $TEST_RECIPIENT"
echo ""

# Create a temporary Node.js script to send test email
cat > /tmp/test-email.js << 'EOF'
const nodemailer = require('nodemailer');

const emailUser = process.argv[2];
const emailPass = process.argv[3];
const recipient = process.argv[4];

if (!emailUser || !emailPass || !recipient) {
    console.error('Missing required parameters');
    process.exit(1);
}

// Create transporter (matching contact route configuration)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPass
    }
});

// Test message
const mailOptions = {
    from: emailUser,
    to: recipient,
    subject: '[TEST] SV Viktoria Wertheim - Email Configuration Test',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af;">Email Configuration Test</h2>
            <p>This is a test email from the SV Viktoria Wertheim website.</p>
            <p><strong>Test Details:</strong></p>
            <ul>
                <li>Timestamp: ${new Date().toLocaleString('de-DE')}</li>
                <li>Environment: ${process.env.NODE_ENV || 'development'}</li>
                <li>From: ${emailUser}</li>
                <li>To: ${recipient}</li>
            </ul>
            <p>If you received this email, your email configuration is working correctly!</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">
                This is an automated test email. Please do not reply.
            </p>
        </div>
    `
};

// Send email
console.log('Sending test email...');
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('❌ Error sending email:', error.message);
        if (error.message.includes('self signed certificate')) {
            console.error('\nTIP: The SMTP server uses a self-signed certificate.');
            console.error('You may need to add: tls: { rejectUnauthorized: false } to the transporter config.');
        } else if (error.message.includes('Invalid login')) {
            console.error('\nTIP: Check your credentials:');
            console.error('- For Gmail, use an app-specific password, not your regular password');
            console.error('- Make sure 2-factor authentication is enabled');
        } else if (error.message.includes('Connection timeout')) {
            console.error('\nTIP: Check your network connection and firewall settings.');
            console.error('Port 587 (or 465 for SSL) needs to be open for SMTP.');
        }
        process.exit(1);
    } else {
        console.log('✅ Test email sent successfully!');
        console.log('   Message ID:', info.messageId);
        console.log('   Response:', info.response);
        console.log('\nPlease check the inbox of:', recipient);
    }
});
EOF

# Check if nodemailer is installed
if ! npm ls nodemailer >/dev/null 2>&1; then
    echo "Installing nodemailer for test..."
    npm install --no-save nodemailer >/dev/null 2>&1
fi

# Run the test
echo "Sending test email..."
node /tmp/test-email.js "$EMAIL_USER" "$EMAIL_PASS" "$TEST_RECIPIENT"

# Clean up
rm -f /tmp/test-email.js

echo ""
echo "Test completed."