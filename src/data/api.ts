import { API } from '../types';

export const apis: API[] = [
  {
    id: 'device-status',
    name: 'Sirius Device Status API',
    description: 'Real-time device status monitoring for Sirius network devices with Singapore data center hosting.',
    category: 'device',
    status: 'available',
    documentation: `# Sirius Device Status API

## Overview
The Device Status API provides real-time monitoring capabilities for IoT and mobile devices across Sirius's Singapore network. Get instant access to critical device metrics and operational states, with data processed in our Singapore data centers.

## Singapore Compliance
- PDPA (Personal Data Protection Act) compliant
- Data stored in Singapore-based data centers
- IMDA (Infocomm Media Development Authority) certified

## Authentication
All API requests require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <your_api_key>
\`\`\`

## Endpoints

### GET /v1/devices/status
Retrieve the current status of a specific device.

**Parameters:**
- \`device_id\` (required): Unique identifier of the device
- \`fields\` (optional): Comma-separated list of specific status fields to retrieve

**Example Request:**
\`\`\`curl
curl -X GET "https://api.Sirius.sg/v1/devices/status?device_id=dev_123" \\
  -H "Authorization: Bearer <your_api_key>"
\`\`\`

**Example Response:**
\`\`\`json
{
  "device_id": "dev_123",
  "status": "online",
  "battery_level": 85,
  "signal_strength": 92,
  "last_seen": "2025-03-15T14:30:00+08:00",
  "connectivity": {
    "type": "cellular",
    "network": "Sirius 5G",
    "ip_address": "192.168.1.100"
  }
}
\`\`\`

### POST /v1/devices/status/batch
Retrieve status information for multiple devices in a single request.

**Request Body:**
\`\`\`json
{
  "device_ids": ["dev_123", "dev_456", "dev_789"],
  "fields": ["battery_level", "connectivity"]
}
\`\`\`

## Rate Limits
- Basic Plan: 100 requests/minute
- Premium Plan: 1000 requests/minute

## Support
24/7 technical support available:
- Phone: 1800 888 9999
- Email: api.support@Sirius.com

## Error Codes
- 400: Invalid request parameters
- 401: Unauthorized - Invalid API key
- 404: Device not found
- 429: Rate limit exceeded`,
    pricing: {
      basic: 0.015,
      premium: 0.025
    }
  },
  {
    id: 'device-location',
    name: 'Sirius Device Location API',
    description: 'Accurate device location tracking across Singapore with Sirius network integration.',
    category: 'location',
    status: 'available',
    documentation: `# Sirius Device Location API

## Overview
Track device locations with high accuracy across Singapore using Sirius's network infrastructure, including GPS, Cell Tower Triangulation, and Wi-Fi positioning.

## Singapore Coverage
- Nationwide coverage across Singapore
- Enhanced accuracy in urban areas
- Indoor positioning support in major buildings
- Integration with Singapore Land Authority (SLA) data

## Authentication
All API requests require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <your_api_key>
\`\`\`

## Endpoints

### GET /v1/devices/location
Get the current location of a device in Singapore.

**Parameters:**
- \`device_id\` (required): Unique identifier of the device
- \`accuracy\` (optional): Desired accuracy level (high, medium, low)
- \`method\` (optional): Preferred positioning method (gps, cell, wifi)

**Example Request:**
\`\`\`curl
curl -X GET "https://api.Sirius.sg/v1/devices/location?device_id=dev_123&accuracy=high" \\
  -H "Authorization: Bearer <your_api_key>"
\`\`\`

**Example Response:**
\`\`\`json
{
  "device_id": "dev_123",
  "timestamp": "2025-03-15T14:30:00+08:00",
  "location": {
    "latitude": 1.2855,
    "longitude": 103.8565,
    "accuracy": 5.2,
    "method": "gps"
  },
  "address": {
    "street": "Orchard Road",
    "building": "ION Orchard",
    "postal_code": "238801",
    "region": "Central Region",
    "country": "Singapore"
  }
}
\`\`\`

### POST /v1/devices/location/history
Retrieve location history for a device within Singapore.

**Request Body:**
\`\`\`json
{
  "device_id": "dev_123",
  "start_time": "2025-03-15T00:00:00+08:00",
  "end_time": "2025-03-15T23:59:59+08:00",
  "interval": "5m"
}
\`\`\`

## Rate Limits
- Basic Plan: 50 requests/minute
- Premium Plan: 500 requests/minute

## Support
24/7 technical support available:
- Phone: 1800 888 9999
- Email: api.support@Sirius.com

## Error Codes
- 400: Invalid request parameters
- 401: Unauthorized - Invalid API key
- 404: Device not found
- 429: Rate limit exceeded`,
    pricing: {
      basic: 0.025,
      premium: 0.045
    }
  },
  {
    id: 'number-verify',
    name: 'Sirius Number Verification API',
    description: 'Verify Singapore phone numbers through Sirius carrier network with PDPA compliance.',
    category: 'verification',
    status: 'available',
    documentation: `# Sirius Number Verification API

## Overview
Secure phone number verification service that validates Singapore numbers through Sirius's carrier network. Perfect for user authentication, fraud prevention, and compliance with Singapore regulations.

## Singapore Compliance
- PDPA compliant verification process
- Singapore-based data processing
- IMDA certified service
- Compliant with MAS digital banking requirements

## Authentication
All API requests require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <your_api_key>
\`\`\`

## Endpoints

### POST /v1/verify/number
Initiate a phone number verification process.

**Request Body:**
\`\`\`json
{
  "phone_number": "+6591234567",
  "channel": "sms"
}
\`\`\`

**Example Response:**
\`\`\`json
{
  "verification_id": "ver_123456",
  "status": "pending",
  "expires_at": "2025-03-15T15:30:00+08:00"
}
\`\`\`

### POST /v1/verify/check
Verify the code received by the user.

**Request Body:**
\`\`\`json
{
  "verification_id": "ver_123456",
  "code": "123456"
}
\`\`\`

### GET /v1/verify/number/info
Get detailed information about a Singapore phone number.

**Parameters:**
- \`phone_number\` (required): Singapore phone number
- \`fields\` (optional): Specific information fields to retrieve

**Example Response:**
\`\`\`json
{
  "phone_number": "+6591234567",
  "valid": true,
  "carrier": {
    "name": "Sirius",
    "type": "mobile"
  },
  "line_type": "postpaid",
  "risk_score": 0.1
}
\`\`\`

## Rate Limits
- Basic Plan: 200 requests/minute
- Premium Plan: 2000 requests/minute

## Support
24/7 technical support available:
- Phone: 1800 888 9999
- Email: api.support@Sirius.com

## Error Codes
- 400: Invalid phone number or request parameters
- 401: Unauthorized - Invalid API key
- 404: Verification not found
- 429: Rate limit exceeded
- 503: Carrier network unavailable`,
    pricing: {
      basic: 0.008,
      premium: 0.015
    }
  }
];
