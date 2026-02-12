# Expense App Server
## How to Run Locally
1. Run `npm install` (one-time)
2. Run `npm start` everytime you make some changes.

## Environment Variables
Create .env file and ensure you are putting below
variables.
```
MONGO_DB_CONNECTION_URI=mongodb://localhost:27017/expense-app
JWT_SECRET=c2f5f5e8-1eb0-43c2-bf07-39983a36a3d6
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_EMAIL=<your-gmail-id>
GOOGLE_APP_PASSWORD=<your-google-app-password>
RAZORPAY_KEY_ID=<your-key-id>
RAZORPAY_KEY_SECRET=<your-key-secret>
RAZORPAY_MONTHLY_PLAN_ID=<your-plan-id>
RAZORPAY_YEARLY_PLAN_ID=<your-plan-id>
RAZORPAY_WEBHOOK_SECRET=<your-webhook-secret>

```