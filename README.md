# AI Media Analyzer

![AI Media Analyzer](https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=300&fit=crop&auto=format)

An intelligent media analysis platform powered by Cosmic AI. Upload any type of media file (images, PDFs, Excel, Word docs, etc.) and ask natural language questions to extract insights and detailed analysis.

## ✨ Features

- **Universal File Upload**: Drag-and-drop interface supporting multiple file types
- **AI-Powered Analysis**: Advanced media analysis using Cosmic AI
- **Natural Language Queries**: Ask questions about your files in plain English
- **Real-time Processing**: Live feedback during upload and analysis
- **Responsive Design**: Works perfectly on desktop and mobile
- **Secure Storage**: Files stored securely in your Cosmic bucket

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68f27d3acfa067083f8f9c3f&clone_repository=68f27e78cfa067083f8f9c44)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> No content model prompt provided - app built from existing content structure

### Code Generation Prompt

> Create a single webpage that enables the user to upload media to Cosmic and use Cosmic AI to get information from the image. It should have:
1. Big media dropzone / upload area
2. Prompt textarea for asking questions

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠 Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Cosmic SDK** - Content management and AI capabilities
- **React Hook Form** - Form handling and validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account and bucket
- Cosmic write key for AI operations

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up your environment variables:
   ```env
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```

4. Run the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Cosmic SDK Examples

### Upload Media File
```typescript
const response = await cosmic.media.insertOne({
  media: file,
  folder: 'ai-uploads',
  metadata: {
    uploaded_by: 'ai-analyzer'
  }
})
```

### Analyze Media with AI
```typescript
const analysis = await cosmic.ai.generateText({
  prompt: 'Analyze this image and describe what you see',
  media_url: mediaUrl,
  max_tokens: 500
})
```

## 🌐 Cosmic CMS Integration

This application leverages Cosmic's powerful AI capabilities and media management:

- **Media Storage**: Files are uploaded to your Cosmic bucket's media library
- **AI Analysis**: Uses Cosmic AI to analyze uploaded media with natural language
- **Secure Processing**: All operations use your bucket's write key for security

## 🚀 Deployment Options

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Netlify
1. Push to GitHub
2. Connect to Netlify
3. Add environment variables
4. Deploy

### Other Platforms
This Next.js app can be deployed to any platform that supports Node.js applications.

<!-- README_END -->