// Test email configuration
const nodemailer = require('nodemailer');

async function testEmailConfig() {
  console.log('Testing email configuration...');
  
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  
  const config = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };
  
  console.log('Email config:', {
    host: config.host,
    port: config.port,
    user: config.auth.user,
    pass: config.auth.pass ? '***' + config.auth.pass.slice(-4) : 'NOT SET'
  });
  
  if (!config.host || !config.auth.user || !config.auth.pass) {
    console.error('❌ Email configuration incomplete!');
    console.log('Required variables:');
    console.log('- SMTP_HOST:', config.host || 'NOT SET');
    console.log('- SMTP_USER:', config.auth.user || 'NOT SET');
    console.log('- SMTP_PASS:', config.auth.pass ? 'SET' : 'NOT SET');
    return;
  }
  
  try {
    const transporter = nodemailer.createTransport(config);
    
    console.log('Testing connection...');
    await transporter.verify();
    console.log('✅ Email configuration is valid!');
    
    // Send test email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"Design&Cart Test" <${config.auth.user}>`,
      to: config.auth.user, // Send to self for testing
      subject: 'Email Configuration Test',
      text: 'If you receive this email, your configuration is working!',
      html: '<p>If you receive this email, your configuration is working! 🎉</p>'
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('- For Gmail: Make sure you\'re using an App Password, not your regular password');
      console.log('- Enable 2-Factor Authentication first');
      console.log('- Generate App Password: Google Account → Security → App passwords');
    }
  }
}

testEmailConfig();