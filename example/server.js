// eslint disable
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5252;

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

const logger = {
  info: (message) => {
    console.info(`${colors.bold}${colors.cyan}info${colors.reset} ${message}`);
  },
  error: (message, error = null) => {
    console.error(
      `${colors.bold}${colors.red}error${colors.reset} ${colors.red}${message}${colors.reset}`,
      error ? `\n${colors.reset}${JSON.stringify(error, null, 2)}` : ''
    );
  },
  warn: (message) => {
    console.warn(
      `${colors.bold}${colors.yellow}warn${colors.reset} ${message}`
    );
  },
  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(
        `${colors.bold}${colors.green}debug ${colors.reset}${message}`,
        data
          ? `\n${colors.dim}${JSON.stringify(data, null, 2)}${colors.reset}`
          : ''
      );
    }
  },
};

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables
const HYPERSWITCH_SECRET_KEY = process.env.HYPERSWITCH_SECRET_KEY;
const HYPERSWITCH_PUBLISHABLE_KEY = process.env.HYPERSWITCH_PUBLISHABLE_KEY;
const PROFILE_ID = process.env.PROFILE_ID;
const HYPERSWITCH_BASE_URL =
  process.env.HYPERSWITCH_SANDBOX_URL || 'https://sandbox.hyperswitch.io';

// Validate required environment variables
if (!HYPERSWITCH_SECRET_KEY || !HYPERSWITCH_PUBLISHABLE_KEY) {
  logger.warn('Missing required environment variables');
  logger.warn('HYPERSWITCH_PUBLISHABLE_KEY: ' + !!HYPERSWITCH_PUBLISHABLE_KEY);
  logger.warn('HYPERSWITCH_SECRET_KEY: ' + !!HYPERSWITCH_SECRET_KEY);
  logger.warn('PROFILE_ID: ' + !!PROFILE_ID);
  process.exit(1);
}

// Hyperswitch API helper function
const makeHyperswitchRequest = async (endpoint, options = {}) => {
  const url = `${HYPERSWITCH_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'api-key': HYPERSWITCH_SECRET_KEY,
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.response = { status: response.status, data };
    throw error;
  }

  return { data };
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: {
      baseUrl: HYPERSWITCH_BASE_URL,
      hasSecretKey: !!HYPERSWITCH_SECRET_KEY,
      hasPublishableKey: !!HYPERSWITCH_PUBLISHABLE_KEY,
    },
  });
});

app.get('/create-payment-intent', async (req, res) => {
  // Prepare payment intent data
  const paymentData = {
    amount: 12347,
    currency: 'USD',
    capture_method: 'automatic',
    authentication_type: 'three_ds',
    setup_future_usage: 'on_session',
    request_external_three_ds_authentication: false,
    email: 'user@gmail.com',
    description: 'Hello this is description',
    shipping: {
      address: {
        line1: '1467',
        line2: 'Harrison Street',
        line3: 'Harrison Street',
        city: 'San Fransico',
        state: 'California',
        zip: '94122',
        country: 'US',
        first_name: 'joseph',
        last_name: 'Doe',
      },
      phone: {
        number: '123456789',
        country_code: '+1',
      },
    },
    connector_metadata: {
      noon: {
        order_category: 'applepay',
      },
    },
    metadata: {
      udf1: 'value1',
      new_customer: 'true',
      login_date: '2019-09-10T10:11:12Z',
    },
    billing: {
      address: {
        line1: '1467',
        line2: 'Harrison Street',
        line3: 'Harrison Street',
        city: 'San Fransico',
        state: 'California',
        zip: '94122',
        country: 'US',
        first_name: 'joseph',
        last_name: 'Doe',
      },
      phone: {
        number: '8056594427',
        country_code: '+91',
      },
    },
    customer_id: 'hyperswitch_sdk_demo_id',
    ...req.body,
  };

  // Add customer_id if provided
  if (process.env.PROFILE_ID) {
    paymentData.profile_id = process.env.PROFILE_ID;
  }

  logger.debug('Creating payment intent with data', paymentData);

  // Make API call to Hyperswitch
  const response = await makeHyperswitchRequest('/payments', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });

  logger.debug('Payment intent created successfully', {
    payment_id: response.data.payment_id,
  });
  // Return the payment intent data
  res.json({
    success: true,
    // payment_intent: response.data,
    clientSecret: response.data.client_secret,
    client_secret: response.data.client_secret,
    publishable_key: HYPERSWITCH_PUBLISHABLE_KEY,
    publishableKey: HYPERSWITCH_PUBLISHABLE_KEY,
  });
});

// Create Payment Intent
app.post('/create-payment-intent', async (req, res) => {
  try {
    // Prepare payment intent data
    const paymentData = {
      amount: 12347,
      currency: 'USD',
      capture_method: 'automatic',
      authentication_type: 'three_ds',
      setup_future_usage: 'on_session',
      request_external_three_ds_authentication: false,
      email: 'user@gmail.com',
      description: 'Hello this is description',
      shipping: {
        address: {
          line1: '1467',
          line2: 'Harrison Street',
          line3: 'Harrison Street',
          city: 'San Fransico',
          state: 'California',
          zip: '94122',
          country: 'US',
          first_name: 'joseph',
          last_name: 'Doe',
        },
        phone: {
          number: '123456789',
          country_code: '+1',
        },
      },
      connector_metadata: {
        noon: {
          order_category: 'applepay',
        },
      },
      metadata: {
        udf1: 'value1',
        new_customer: 'true',
        login_date: '2019-09-10T10:11:12Z',
      },
      billing: {
        address: {
          line1: '1467',
          line2: 'Harrison Street',
          line3: 'Harrison Street',
          city: 'San Fransico',
          state: 'California',
          zip: '94122',
          country: 'US',
          first_name: 'joseph',
          last_name: 'Doe',
        },
        phone: {
          number: '8056594427',
          country_code: '+91',
        },
      },
      customer_id: 'hyperswitch_sdk_demo_id',
      ...req.body,
    };

    // Add customer_id if provided
    if (process.env.PROFILE_ID) {
      paymentData.profile_id = process.env.PROFILE_ID;
    }

    logger.debug('Creating payment intent with data', paymentData);

    // Make API call to Hyperswitch
    const response = await makeHyperswitchRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });

    logger.debug('Payment intent created successfully', {
      payment_id: response.data.payment_id,
    });
    // Return the payment intent data
    res.json({
      success: true,
      // payment_intent: response.data,
      clientSecret: response.data.client_secret,
      client_secret: response.data.client_secret,
      publishable_key: HYPERSWITCH_PUBLISHABLE_KEY,
      publishableKey: HYPERSWITCH_PUBLISHABLE_KEY,
    });
  } catch (error) {
    logger.error(
      'Error creating payment intent',
      error.response?.data || error.message
    );

    res.status(error.response?.status || 500).json({
      error: 'Failed to create payment intent',
      details: error.response?.data || error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error', error);
  res.status(500).json({
    error: 'Internal server error',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Start server
app
  .listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Hyperswitch server running on port ${PORT}`);
    logger.info(`📋 iOS Health check: http://localhost:${PORT}/health`);
    logger.info(`📋 Android Health check: http://10.0.2.2:${PORT}/health`);
    logger.info(
      `💳 iOS Create payment: POST http://localhost:${PORT}/create-payment-intent`
    );
    logger.info(
      `💳 Android Create payment: POST http://10.0.2.2:${PORT}/create-payment-intent`
    );
    logger.info(`🌐 Environment: ${HYPERSWITCH_BASE_URL}`);
    logger.info(
      `📱 Server accessible from Android simulator via 10.0.2.2:${PORT}`
    );
  })
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.error(`❌ Port ${PORT} is already in use!`);
      process.exit(1);
    } else {
      logger.error('Server error:', err);
      process.exit(1);
    }
  });

module.exports = app;
