# 🚀 Quick Deployment Guide

## Step-by-Step Vercel Deployment

### 1. Prepare Your Code

```bash
# Navigate to the project directory
cd roktok

# Install dependencies
npm install
```

### 2. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Save it securely - you'll need it for deployment

### 3. Test Locally (Optional but Recommended)

```bash
# Create .env.local file
echo "OPENAI_API_KEY=sk-your-key-here" > .env.local

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

### 4. Deploy to Vercel

#### Method A: Using Vercel CLI (Fastest)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow the prompts)
vercel

# Add your OpenAI API key
vercel env add OPENAI_API_KEY production

# Enter your OpenAI API key when prompted

# Deploy to production
vercel --prod
```

#### Method B: Using Vercel Dashboard (Easiest)

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: RokTok app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/roktok.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Visit https://vercel.com/new
   - Click "Import Project"
   - Select your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: `.next`
   
3. **Add Environment Variable**
   - In the "Environment Variables" section:
     - Name: `OPENAI_API_KEY`
     - Value: `sk-your-openai-key-here`
     - Environment: All (Production, Preview, Development)
   - Click "Deploy"

4. **Wait for Deployment**
   - Vercel will build and deploy your app (takes 2-3 minutes)
   - You'll get a URL like: `https://roktok-xyz.vercel.app`

### 5. Verify Deployment

1. Open your Vercel URL
2. Wait for the loading screen
3. Content should start appearing
4. Test gestures:
   - Swipe up/down
   - Click "Show Options"
   - Select an answer

### 6. Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting Deployment

### Build Fails

```bash
# Clear cache and rebuild locally
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variable Not Working

1. Go to Vercel dashboard
2. Project Settings → Environment Variables
3. Make sure `OPENAI_API_KEY` is set for "Production"
4. Redeploy the project

### API Errors After Deployment

- Check Vercel logs: Project → Deployments → [Latest] → Function Logs
- Verify OpenAI API key is valid
- Check OpenAI account has available credits

## Quick Commands Reference

```bash
# Local development
npm run dev

# Build for production
npm run build

# Start production server locally
npm run start

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs
```

## Cost Estimates

### Vercel (Hosting)
- **Free Tier**: 100GB bandwidth, unlimited deployments
- **Cost**: $0/month for personal projects

### OpenAI API
- **GPT-4**: ~$0.03 per generation
- **Estimated**: ~1,000 requests/month = ~$30/month
- **Tip**: Use GPT-3.5-turbo for cheaper option (~$0.002 per generation)

### Total Monthly Cost
- Small traffic: ~$0-30/month
- Medium traffic: ~$30-100/month

## Switching to GPT-3.5-turbo (Cheaper Option)

Edit `app/api/generate-content/route.ts`:

```typescript
// Change this line:
model: 'gpt-4',

// To this:
model: 'gpt-3.5-turbo',
```

This reduces costs by ~90% with slightly lower quality content.

## Support

- **Vercel Issues**: https://vercel.com/support
- **OpenAI Issues**: https://help.openai.com
- **Next.js Docs**: https://nextjs.org/docs

---

✅ Your app should now be live at your Vercel URL!
