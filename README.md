# Website Monitoring Service

## Setup Instructions

### 1. Install Node.js and NPM
- **Windows**: Follow [Microsoft's guide](https://docs.microsoft.com/en-us/windows/nodejs/setup-on-windows)
- **Mac/Linux**: Use [nvm](https://github.com/nvm-sh/nvm) (recommended) or download from [Node.js website](https://nodejs.org/)

### 2. Install Dependencies
In the project root directory:
```bash
npm install
```

### 3. Environment Configuration
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` with your configuration:

   **Proxy Settings**:
   - Set `INTERNAL_PROXY_HOST` and `INTERNAL_PROXY_PORT` for internal network access
   - Set `EXTERNAL_PROXY_HOST` and `EXTERNAL_PROXY_PORT` for external network access
   
   **Email Settings**:
   - Configure SMTP settings:
     ```
     MAIL_HOST=your-smtp-server
     MAIL_HOST_PORT=587
     MAIL_USER_NAME=your-email
     MAIL_USER_PASSWORD=your-password
     MAIL_FROM_ADDRESS=sender-email
     ```
   - Add notification recipients:
     ```
     NOTIFICATION_EMAIL_ADDRESSES=email1,email2
     ```

   > ⚠️ **Security Note**: 
   > - Never commit the `.env` file to version control
   > - Keep your SMTP credentials and API keys secure
   > - Use strong passwords for email accounts
   > - Consider using environment-specific `.env` files for different deployments

### 4. Run the Service
```bash
npm start
```

## Development
```bash
npm run dev  # Runs with auto-reload on file changes
```
