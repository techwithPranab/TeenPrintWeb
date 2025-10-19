import sgMail from '@sendgrid/mail';

// Initialize SendGrid only if API key is configured
const isSendGridConfigured = process.env.SENDGRID_API_KEY &&
  process.env.SENDGRID_FROM_EMAIL &&
  process.env.SENDGRID_FROM_NAME &&
  process.env.SENDGRID_API_KEY.startsWith('SG.') &&
  process.env.SENDGRID_FROM_EMAIL !== 'noreply@teenprint.com';

let sendGridInitialized = false;

if (isSendGridConfigured) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sendGridInitialized = true;
  console.log('SendGrid initialized successfully');
} else {
  console.log('SendGrid not configured - email features will be disabled');
}

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@teenprint.com';
const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'TeenPrint';

/**
 * Send email using SendGrid
 */
const sendEmail = async (to, subject, html, text = null) => {
  if (!sendGridInitialized) {
    console.log('SendGrid not configured - skipping email send');
    return;
  }

  try {
    const msg = {
      to,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      subject,
      html,
      text: text || html.replaceAll(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('SendGrid error:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (user) => {
  const subject = `Welcome to TeenPrint, ${user.firstName}!`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3B82F6;">Welcome to TeenPrint! 🎨</h1>
      <p>Hi ${user.firstName},</p>
      <p>Thank you for joining TeenPrint! We're excited to help you create amazing custom products.</p>
      <p>Get started by exploring our product catalog and unleashing your creativity with our design editor.</p>
      <a href="${process.env.FRONTEND_URL}/products" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Start Designing</a>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Happy Designing!<br/>Team TeenPrint</p>
    </div>
  `;

  await sendEmail(user.email, subject, html);
};

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (user, order) => {
  const subject = `Order Confirmation - ${order.orderId}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #10B981;">Order Confirmed! ✅</h1>
      <p>Hi ${user.firstName},</p>
      <p>Thank you for your order! Your order <strong>#${order.orderId}</strong> has been confirmed.</p>
      
      <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${order.items
            .map(
              (item) => `
            <tr>
              <td style="padding: 8px 0;">${item.productName} (${item.size}, ${item.color})</td>
              <td style="text-align: right; padding: 8px 0;">x${item.quantity}</td>
              <td style="text-align: right; padding: 8px 0;">₹${item.subtotal}</td>
            </tr>
          `
            )
            .join('')}
          <tr style="border-top: 2px solid #D1D5DB;">
            <td colspan="2" style="padding: 8px 0; font-weight: bold;">Total</td>
            <td style="text-align: right; padding: 8px 0; font-weight: bold;">₹${order.pricing.total}</td>
          </tr>
        </table>
      </div>

      <p><strong>Shipping Address:</strong><br/>
      ${order.shippingAddress.fullName}<br/>
      ${order.shippingAddress.addressLine1}<br/>
      ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>

      <a href="${process.env.FRONTEND_URL}/orders/${order._id}" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Track Order</a>

      <p>We'll send you another email when your order ships.</p>
      <p>Thank you for choosing TeenPrint!</p>
    </div>
  `;

  await sendEmail(user.email, subject, html);
};

/**
 * Send order status update email
 */
export const sendOrderStatusEmail = async (user, order, newStatus) => {
  const statusMessages = {
    processing: {
      title: 'Order Processing',
      message: 'Your order is being prepared.',
      emoji: '⏳',
    },
    printing: {
      title: 'Design Printing',
      message: 'Your custom design is being printed.',
      emoji: '🖨️',
    },
    shipped: {
      title: 'Order Shipped',
      message: 'Your order is on its way!',
      emoji: '🚚',
    },
    delivered: {
      title: 'Order Delivered',
      message: 'Your order has been delivered.',
      emoji: '🎉',
    },
  };

  const status = statusMessages[newStatus];
  if (!status) return;

  const subject = `${status.title} - ${order.orderId}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3B82F6;">${status.title} ${status.emoji}</h1>
      <p>Hi ${user.firstName},</p>
      <p>${status.message}</p>
      <p>Order ID: <strong>#${order.orderId}</strong></p>
      ${
        order.shipping.trackingNumber
          ? `<p>Tracking Number: <strong>${order.shipping.trackingNumber}</strong></p>`
          : ''
      }
      <a href="${process.env.FRONTEND_URL}/orders/${order._id}" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Track Order</a>
      <p>Thank you for shopping with TeenPrint!</p>
    </div>
  `;

  await sendEmail(user.email, subject, html);
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const subject = 'Password Reset Request';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3B82F6;">Password Reset Request</h1>
      <p>Hi ${user.firstName},</p>
      <p>You requested to reset your password. Click the button below to reset it:</p>
      <a href="${resetUrl}" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Team TeenPrint</p>
    </div>
  `;

  await sendEmail(user.email, subject, html);
};

export { sendEmail };
