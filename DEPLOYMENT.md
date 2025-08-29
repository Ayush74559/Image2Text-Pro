# Deployment Guide for Image2Text Pro

## Production Deployment Options

### Option 1: Docker Deployment (Recommended)

1. **Install Docker and Docker Compose**
   ```bash
   # macOS
   brew install docker docker-compose
   
   # Ubuntu
   sudo apt-get install docker.io docker-compose
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Option 2: Cloud Deployment

#### Frontend (Vercel/Netlify)

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Deploy to Netlify**
   - Drag and drop the `build` folder to Netlify
   - Or connect your GitHub repository

#### Backend (Railway/Heroku)

1. **Railway Deployment**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

2. **Heroku Deployment**
   ```bash
   # Install Heroku CLI
   brew install heroku/brew/heroku
   
   # Create Heroku app
   heroku create image2text-pro-backend
   
   # Add buildpacks
   heroku buildpacks:add --index 1 https://github.com/heroku/heroku-buildpack-apt
   heroku buildpacks:add --index 2 heroku/python
   
   # Create Aptfile for Tesseract
   echo "tesseract-ocr\ntesseract-ocr-eng\ntesseract-ocr-hin" > backend/Aptfile
   
   # Deploy
   git subtree push --prefix backend heroku main
   ```

### Option 3: VPS Deployment

1. **Server Setup (Ubuntu)**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install Python and dependencies
   sudo apt install -y python3 python3-pip python3-venv
   
   # Install Tesseract
   sudo apt install -y tesseract-ocr tesseract-ocr-eng tesseract-ocr-hin
   
   # Install Nginx
   sudo apt install -y nginx
   
   # Install PM2 for process management
   sudo npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd image2text-pro
   
   # Setup backend
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
   # Setup frontend
   cd ../frontend
   npm install
   npm run build
   
   # Start backend with PM2
   cd ../backend
   pm2 start "uvicorn app.main:app --host 0.0.0.0 --port 8000" --name "image2text-backend"
   
   # Serve frontend with Nginx
   sudo cp -r ../frontend/build/* /var/www/html/
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           root /var/www/html;
           index index.html;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## Environment Variables

### Backend
- `DATABASE_URL`: SQLite database URL (default: sqlite:///./image_text_history.db)
- `CORS_ORIGINS`: Allowed CORS origins (default: http://localhost:3000)
- `MAX_FILE_SIZE`: Maximum upload file size in bytes (default: 20MB)

### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:8000)

## Security Considerations

1. **File Upload Security**
   - File type validation
   - File size limits
   - Virus scanning (recommended for production)

2. **API Rate Limiting**
   - Implement rate limiting to prevent abuse
   - Consider using Redis for distributed rate limiting

3. **HTTPS**
   - Always use HTTPS in production
   - Use Let's Encrypt for free SSL certificates

4. **Database Security**
   - Use PostgreSQL or MySQL for production
   - Implement proper database security measures
   - Regular backups

## Monitoring and Logging

1. **Application Monitoring**
   - Use tools like Sentry for error tracking
   - Implement health checks
   - Monitor API performance

2. **Logging**
   - Implement structured logging
   - Log important events and errors
   - Use log aggregation tools

## Backup Strategy

1. **Database Backups**
   ```bash
   # SQLite backup
   sqlite3 image_text_history.db ".backup backup_$(date +%Y%m%d_%H%M%S).db"
   ```

2. **File Backups**
   - Regular backup of uploaded files
   - Consider cloud storage for backups

## Performance Optimization

1. **Frontend Optimization**
   - Image compression before upload
   - Lazy loading of components
   - Code splitting

2. **Backend Optimization**
   - Database indexing
   - Caching frequently accessed data
   - Optimize OCR processing

3. **Infrastructure**
   - Use CDN for static assets
   - Load balancing for high traffic
   - Database optimization
