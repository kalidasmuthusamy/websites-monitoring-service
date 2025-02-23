# Website Monitoring Service

A robust service that monitors website availability and sends email notifications with detailed reports.

## Features
- Monitor multiple websites simultaneously
- Email notifications with detailed status reports
- CSV reports for detailed analysis
- Configurable monitoring schedules using cron expressions
- Automatic retries and error handling
- Detailed logging for troubleshooting

## Prerequisites

### 1. Node.js and NPM
- **Required versions**: Node.js >= 14.x, NPM >= 6.x
- **Windows**: 
  1. Download from [Node.js website](https://nodejs.org/) (LTS version recommended)
  2. Run the installer and follow the prompts
  3. Verify installation: `node --version` and `npm --version`
- **Mac**: 
  1. Install using Homebrew: `brew install node`
  2. Or use [nvm](https://github.com/nvm-sh/nvm) (recommended):
     ```bash
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
     nvm install --lts
     nvm use --lts
     ```
- **Linux**:
  1. Using nvm (recommended):
     ```bash
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
     nvm install --lts
     nvm use --lts
     ```
  2. Or using package manager:
     ```bash
     # Ubuntu/Debian
     curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
     sudo apt-get install -y nodejs

     # CentOS/RHEL
     curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
     sudo yum install -y nodejs
     ```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/websites-monitoring-service.git
cd websites-monitoring-service
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
1. Create your environment file:
   ```bash
   cp .env.example .env
   ```

2. Configure your `.env` file:
   ```ini
   # Email Configuration (Required)
   MAIL_HOST=smtp.gmail.com          # SMTP server host
   MAIL_HOST_PORT=587               # SMTP server port
   MAIL_USER_NAME=your-email@gmail.com
   MAIL_USER_PASSWORD=your-app-specific-password  # For Gmail, use App Password
   MAIL_FROM_ADDRESS=your-email@gmail.com

   # Notification Configuration (Required)
   NOTIFICATION_EMAIL_ADDRESSES=admin1@example.com,admin2@example.com

   # Debug Configuration (Optional)
   DEBUG_MODE=false                 # Set to true for detailed logging
   ```

   **Important Notes**:
   - For Gmail:
     1. Enable 2-Step Verification in your Google Account
     2. Generate an App Password: Google Account → Security → App Passwords
     3. Use the generated App Password in MAIL_USER_PASSWORD
   - For other email providers:
     - Check their SMTP settings and authentication requirements
     - Some providers may require enabling "Less secure app access"

### 4. Start the Service

#### Development Mode
```bash
# Run with auto-reload on file changes
npm run dev
```

#### Production Mode
```bash
# Build the TypeScript code
npm run build

# Start the service
npm start
```

## Monitoring Configuration

### Basic Configuration
1. Create a new monitoring configuration file:
   ```bash
   cp config/monitoring.example.json config/monitoring.json
   ```

2. Edit `config/monitoring.json`:
   ```json
   {
     "batches": [
       {
         "id": "main-websites",
         "name": "Main Websites",
         "schedule": "*/5 * * * *",  // Every 5 minutes
         "enabled": true,
         "endpoints": [
           {
             "name": "Google",
             "url": "https://www.google.com",
             "method": "GET",
             "expectedStatusCode": 200
           }
         ],
         "notification": {
           "emails": ["your-email@example.com"],
           "customSubject": "Main Websites Status"
         }
       }
     ]
   }
   ```

### Advanced Configuration
- **Custom Headers**:
  ```json
  "headers": {
    "Authorization": "Bearer your-token",
    "Custom-Header": "value"
  }
  ```
- **Request Body** (for POST/PUT):
  ```json
  "body": {
    "key": "value"
  }
  ```
- **Timeout Settings**:
  ```json
  "timeout": 5000  // milliseconds
  ```

## Troubleshooting

### Common Issues

1. **Email Sending Fails**:
   - Verify SMTP settings in `.env`
   - For Gmail: ensure App Password is correct
   - Check if email service is blocked by firewall

2. **Monitor Not Running**:
   - Verify cron expression in configuration
   - Check system timezone matches configuration
   - Enable DEBUG_MODE for detailed logs

3. **High Memory Usage**:
   - Adjust concurrent request limits
   - Review monitoring intervals
   - Check for memory leaks in custom configurations

### Debug Mode
Enable debug mode in `.env`:
```ini
DEBUG_MODE=true
```

View logs:
```bash
npm run logs
```

## Contributing
1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License
This project is licensed under the MIT License - see the LICENSE file for details.
