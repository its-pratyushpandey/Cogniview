# VAPI Setup Guide

This guide will help you set up VAPI (Voice AI Platform Integration) for the AI Voice Interview application.

## Prerequisites

1. A VAPI account (sign up at [https://dashboard.vapi.ai](https://dashboard.vapi.ai))
2. Your Firebase project already configured (see FIREBASE_SETUP.md)

## Step 1: Create VAPI Account and Get Credentials

1. **Sign up for VAPI**:
   - Go to [https://dashboard.vapi.ai](https://dashboard.vapi.ai)
   - Create an account or sign in

2. **Get your Web Token**:
   - In your VAPI dashboard, navigate to "API Keys" or "Settings"
   - Look for "Web Token" or "Public Key"
   - Copy this token (it should start with something like `pk_`)

## Step 2: Configure Environment Variables

1. **Update your `.env.local` file**:
   ```bash
   # VAPI Configuration
   NEXT_PUBLIC_VAPI_WEB_TOKEN=your_actual_vapi_web_token_here
   ```

2. **Replace the placeholder**:
   - Replace `your_vapi_web_token_here` with your actual VAPI Web Token
   - This token is safe to use in client-side code (that's why it has `NEXT_PUBLIC_` prefix)

## Step 3: Understanding the Voice Interview Flow

### Interview Generation (`type="generate"`)
- Used on the home page to create new interview questions
- The AI assistant will gather information about:
  - Job role/position
  - Experience level (Junior, Mid, Senior)
  - Interview focus (Technical, Behavioral, Mixed)
  - Tech stack or skills
  - Number of questions desired

### Interview Conduct (`type="interview"`)
- Used during actual interview sessions
- The AI interviewer will ask the generated questions
- Provides a realistic interview experience with follow-up questions

## Step 4: Testing the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test Interview Generation**:
   - Go to the homepage
   - Click "Generate Interview" button
   - You should see the voice interface activate
   - The AI should greet you and start gathering interview requirements

3. **Test Interview Conduct**:
   - Create or navigate to an existing interview
   - Click "Start Interview" button
   - The AI interviewer should begin asking the prepared questions

## Troubleshooting

### Common Issues

1. **"VAPI is not configured" error**:
   - **MOST COMMON**: You still have the placeholder token `your_vapi_web_token_here`
   - **SOLUTION**: Replace it with your actual token from https://dashboard.vapi.ai
   - Check that you've added `NEXT_PUBLIC_VAPI_WEB_TOKEN` to `.env.local`
   - Restart your development server after adding environment variables
   - Your token should start with something like `pk_` or be a long alphanumeric string

2. **"Assistant or Squad must be provided" error**:
   - This should be resolved with the updated Agent component
   - If you still see this, check browser console for more details

3. **Voice not working**:
   - Ensure your browser allows microphone access
   - Check that you're using HTTPS in production (required for microphone access)
   - Test with different browsers (Chrome, Firefox, Safari)

4. **Connection issues**:
   - Verify your VAPI token is valid and active
   - Check your internet connection
   - Look at browser developer tools for network errors

### Browser Permissions

The voice interview feature requires microphone access:
- Your browser will prompt for microphone permission
- Make sure to allow access for the application to work
- In production, HTTPS is required for microphone access

## Features

### Interview Generator Assistant
- **Purpose**: Gathers requirements to create personalized interviews
- **Capabilities**: 
  - Conversational interface for requirement gathering
  - Intelligent question generation based on role and skills
  - Customizable difficulty levels

### Interview Conductor Assistant
- **Purpose**: Conducts the actual voice interview
- **Capabilities**:
  - Professional interviewer persona
  - Dynamic follow-up questions
  - Natural conversation flow
  - Interview assessment and feedback

## Production Deployment

### Environment Variables
Make sure to set the following in your production environment:
```bash
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_production_vapi_token
```

### HTTPS Requirement
- Voice features require HTTPS in production
- Most hosting platforms (Vercel, Netlify, etc.) provide HTTPS by default

### Rate Limits
- VAPI has usage limits based on your plan
- Monitor your usage in the VAPI dashboard
- Consider implementing user limits if needed

## Cost Considerations

- VAPI charges based on usage (minutes of voice conversation)
- Check your VAPI dashboard for current usage and limits
- Consider implementing user session limits for cost control

## Support

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Test with a simple VAPI example first
4. Contact VAPI support through their dashboard

## Advanced Configuration

For advanced users, you can customize:
- Voice settings (accent, speed, tone)
- AI model parameters
- Custom system prompts
- Conversation flow logic

Refer to the VAPI documentation for detailed API references and advanced features.