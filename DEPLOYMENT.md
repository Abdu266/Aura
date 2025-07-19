# Deploy Aura to Vercel with Neon Database

## Step 1: Download Your Code
1. In Replit, click the 3 dots menu → "Download as zip"
2. Extract the zip file on your computer

## Step 2: Set Up Database (Neon - Free PostgreSQL)
1. Go to https://neon.tech and create a free account
2. Create a new project called "aura-migraine-app"
3. Copy the connection string (it looks like: postgresql://username:password@host/database?sslmode=require)
4. Save this - you'll need it in Step 4

## Step 3: Prepare for Vercel
1. Open the extracted folder in VS Code or any text editor
2. Replace `package.json` with the contents from `package.json.vercel`
3. Delete `package.json.vercel` file
4. Create a `.gitignore` file with this content:
```
node_modules/
.env
.env.local
dist/
.vercel/
```

## Step 4: Deploy to Vercel
1. Go to https://vercel.com and sign up/login
2. Click "New Project"
3. Choose "Import Git Repository" and upload your folder OR connect your GitHub if you pushed it there
4. In "Environment Variables" section, add:
   - Key: `DATABASE_URL`
   - Value: [Your Neon connection string from Step 2]
5. Click "Deploy"

## Step 5: Set Up Database Tables
1. After deployment, go to your project dashboard on Vercel
2. Click "Functions" tab → find your API function
3. In terminal/command line on your computer:
   ```bash
   npm install -g drizzle-kit
   DATABASE_URL="your_neon_connection_string" npx drizzle-kit push
   ```
4. This creates all the required tables

## Step 6: Add Test User (Optional)
Connect to your Neon database and run:
```sql
INSERT INTO users (username, password, email, dark_mode, font_size, high_contrast, timezone) 
VALUES ('testuser', 'hashedpassword', 'test@example.com', false, 'medium', false, 'UTC');
```

## Step 7: Access Your App
Your app will be available at: `https://your-project-name.vercel.app`

## Troubleshooting
- If build fails: Check the Vercel function logs
- If database connection fails: Verify your DATABASE_URL is correct
- If app doesn't load: Check that all dependencies are in package.json

## File Structure for Vercel
```
/
├── vercel.json (deployment config)
├── package.json (dependencies & scripts)
├── server/ (backend API)
├── client/ (frontend React app)
├── shared/ (database schema)
└── drizzle.config.ts (database config)
```

Your app will work exactly the same as in Replit but with your own database and hosting!