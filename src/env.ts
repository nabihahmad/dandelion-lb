// Environment variables configuration
export const config = {
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '9613000000',
  emailAddress: import.meta.env.VITE_EMAIL_ADDRESS || 'hello@dandelion.com',
  makeWebhookUrl: import.meta.env.VITE_MAKE_WEBHOOK_URL || 'https://hooks.zapier.com/hooks/catch/123456/abcdef',
  makeApiKey: import.meta.env.VITE_MAKE_API_KEY || 'your_make_api_key_here',
};
