# 🎯 RokTok - Educational Content Platform

A TikTok-style mobile-first web application that combines engaging content with interactive quizzes. Built with Next.js, TypeScript, and OpenAI.

## ✨ Features

- 📱 **Mobile-First Design**: Optimized for mobile devices with touch gestures
- 🤖 **AI-Powered Content**: Automatically generates educational content and quizzes using OpenAI
- 🎨 **Beautiful UI**: Smooth animations and modern design with Framer Motion
- 📊 **Interactive Quizzes**: Engaging multiple-choice questions for each content piece
- 🔄 **Infinite Scroll**: Seamless vertical scrolling experience
- 🎯 **No Login Required**: Instant access to content

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS-in-JS (styled-jsx)
- **Animations**: Framer Motion
- **AI**: OpenAI GPT-4
- **Deployment**: Vercel
- **Images**: Unsplash API

## 📋 Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Vercel account (for deployment)

## 🛠️ Installation

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Add Environment Variable**
   
   After deployment, add your OpenAI API key:
   ```bash
   vercel env add OPENAI_API_KEY
   ```
   
   Then redeploy:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Add environment variable:
     - Name: `OPENAI_API_KEY`
     - Value: Your OpenAI API key
   - Click "Deploy"

## 📱 How to Use

1. **Swipe Gestures**
   - Swipe up: Next content
   - Swipe down: Previous content

2. **Navigation Buttons**
   - Bottom arrows: Navigate between content
   - "Show Options" button: Reveal quiz options

3. **Quiz Interaction**
   - Tap an option to select your answer
   - Green highlight: Correct answer
   - Red highlight: Incorrect answer

## 🎨 Customization

### Change Content Topics

Edit the `topics` array in `app/api/generate-content/route.ts`:

```typescript
const topics = [
  'Your Topic 1',
  'Your Topic 2',
  // Add more topics...
];
```

### Modify AI Prompts

Update the system message in `app/api/generate-content/route.ts`:

```typescript
{
  role: 'system',
  content: 'Your custom prompt here...'
}
```

### Adjust Colors and Styling

Colors and styles are defined in the `<style jsx global>` section in `app/page.tsx`. Key variables:

- Main gradient: `#667eea` to `#764ba2`
- Background overlays
- Button styles
- Animation timings

## 🔧 API Endpoints

### POST `/api/generate-content`

Generates a new content piece with a quiz question.

**Response:**
```json
{
  "content": "Educational fact or news",
  "question": "Related quiz question",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswer": 0,
  "imageUrl": "https://...",
  "topic": "Science"
}
```

## 📊 Project Structure

```
roktok/
├── app/
│   ├── api/
│   │   └── generate-content/
│   │       └── route.ts          # OpenAI integration
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main app component
├── .env.example                  # Environment variables template
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## 🐛 Troubleshooting

### OpenAI API Errors

- **401 Unauthorized**: Check your API key is correct in `.env.local`
- **429 Rate Limit**: You've exceeded your API quota
- **500 Server Error**: OpenAI might be down or the prompt needs adjustment

### Build Issues

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Mobile Gestures Not Working

- Ensure you're testing on a mobile device or using browser DevTools mobile emulation
- Check that touch events aren't being blocked by other elements

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |

## 🔒 Security Notes

- Never commit `.env.local` or `.env` files
- Keep your OpenAI API key private
- Use environment variables in Vercel for production
- Consider implementing rate limiting for production use

## 🚀 Performance Tips

1. **Image Optimization**: Images are lazy-loaded from Unsplash
2. **Pre-fetching**: Content is pre-fetched before the user reaches the last item
3. **Animations**: CSS-based animations for better performance
4. **Code Splitting**: Next.js automatically splits code for optimal loading

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For issues or questions:
- Check the troubleshooting section above
- Review the OpenAI API documentation
- Check Next.js documentation

## 🎯 Future Enhancements

- [ ] User accounts and progress tracking
- [ ] Leaderboards
- [ ] Share functionality
- [ ] Custom content categories
- [ ] Audio narration
- [ ] Multiple language support
- [ ] Offline mode
- [ ] Analytics dashboard

---

Built with ❤️ using Next.js and OpenAI
