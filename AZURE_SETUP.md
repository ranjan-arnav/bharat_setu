# Bharat Setu - Azure Services Setup Guide

## Overview

Bharat Setu uses several Azure AI services to power its features. This guide explains how to configure each service and what happens when they're not configured.

## Required Services

### 1. Azure Vision API (for Grievance Image Analysis)

**Used in**: Filing a Grievance (GrievanceForm component)

**Status**: Currently using demo/fallback mode

**Setup**:
1. Create an Azure Computer Vision resource in Azure Portal
2. Go to "Keys and Endpoint" section
3. Copy the endpoint URL and one of the keys
4. Add to `.env.local`:
   ```
   AZURE_VISION_ENDPOINT=https://your-vision.cognitiveservices.azure.com/
   AZURE_VISION_KEY=your-vision-key-here
   ```

**Fallback Behavior**: If not configured, the system uses context-aware demo data based on the selected category (road, water, electricity, etc.). Users can still file grievances successfully.

**How to tell it's in demo mode**:
- Check browser console for: `⚠️ Image provided but AZURE_VISION_KEY not configured - using demo analysis`
- The result screen shows: "Configure AZURE_VISION_KEY for real-time Azure Vision analysis"

### 2. Azure Content Safety (for Grievance Moderation)

**Used in**: GrievanceForm - checks submitted text for harmful content

**Setup**:
```
AZURE_CONTENT_SAFETY_ENDPOINT=https://your-content-safety.cognitiveservices.azure.com/
AZURE_CONTENT_SAFETY_KEY=your-content-safety-key-here
```

**Fallback Behavior**: If not configured, content safety checks are skipped and all grievances are accepted.

### 3. Azure OpenAI (for AI Agents)

**Used in**: Council of Five agents (Nagarik Mitra, Swasthya Sahayak, etc.)

**Setup**:
```
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT=gpt-4o
```

**Alternative**: Can use GitHub Models (free tier) instead:
```
GITHUB_TOKEN=github_pat_your_token_here
```

### 4. Azure AI Search (for Scheme Matching)

**Used in**: Scheme Scanner to match citizens with 800+ government schemes

**Setup**:
```
AZURE_SEARCH_ENDPOINT=https://your-search.search.windows.net
AZURE_SEARCH_KEY=your-search-key-here
AZURE_SEARCH_INDEX=schemes-index
```

### 5. Azure Speech (for Voice Assistant)

**Used in**: Voice Assistant (VoiceAssistant component)

**Setup**:
```
AZURE_SPEECH_KEY=your-speech-key-here
AZURE_SPEECH_REGION=centralindia
```

### 6. Azure Maps (for Location Services)

**Used in**: Emergency Services, DIGIPIN location mapping

**Setup**:
```
AZURE_MAPS_KEY=your-maps-key-here
```

**Note**: Currently using Bing Maps for some features as fallback.

### 7. Azure Translator (for Multi-language Support)

**Used in**: i18n translation for Hindi, Tamil, Bengali, etc.

**Setup**:
```
AZURE_TRANSLATOR_KEY=your-translator-key-here
AZURE_TRANSLATOR_REGION=centralindia
```

## Quick Start

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Azure credentials

3. Restart the development server:
   ```bash
   npm run dev
   ```

## Debugging

### Check if Azure Vision is working:

1. File a grievance with an image
2. Open browser console (F12)
3. Look for these messages:
   - ✅ `Azure Vision analysis successful` - Working!
   - ⚠️ `Image provided but AZURE_VISION_KEY not configured` - Keys missing
   - ❌ `Azure Vision API error: 401` - Invalid key
   - ❌ `Azure Vision API error: 404` - Wrong endpoint

### API Route Logs:

The grievance API route (`/api/grievance`) logs all operations:
- `✅ Grievance registered:` - Success with details
- `⚠️ Using demo fallback mode` - API error, using demo data
- `❌ Grievance API error:` - Unexpected error

## Current Implementation Status

### ✅ Working (with or without Azure Keys)
- Grievance filing (falls back to demo analysis)
- Case tracking and navigation
- Light/Dark mode
- PWA functionality
- DIGIPIN locator
- Emergency services
- Mobile-only profile flow

### 🔧 Requires Azure Configuration
- Real-time Azure Vision image analysis
- Content safety moderation
- AI agent conversations
- Scheme DNA matching
- Voice assistant
- Azure Maps integration

### 🎯 Demo Mode Features
When Azure keys are not configured, these features use intelligent fallback data:
- Image analysis uses category-based templates
- Grievance IDs are generated locally
- Demo department routing
- Context-aware tags and captions

## Cost Optimization

### Free Tier Options:
1. **Azure Vision**: 5,000 transactions/month free
2. **Azure Content Safety**: 5,000 text records/month free
3. **GitHub Models**: Free tier for GPT-4o-mini
4. **Azure AI Search**: Free tier with 50MB storage

### Recommended for Development:
- Start with GitHub Models for AI agents (free)
- Use Azure Vision free tier (sufficient for testing)
- Skip Content Safety initially (app works without it)

## Troubleshooting

### Grievance images not analyzed
- Check `.env.local` has `AZURE_VISION_KEY` and `AZURE_VISION_ENDPOINT`
- Verify key is active in Azure Portal
- Look for error messages in browser console
- Check API route logs in terminal

### TrackCasesOverlay navigation not working
- Check browser console for button click logs
- Verify no JavaScript errors preventing clicks
- Test with: Open "My Cases & Tracking" → Click "Ask Agent" or "File Grievance"
- Should see console logs: `Opening agent chat for:` or `Opening grievance form from track overlay`

## Next Steps

1. **Immediate**: Configure AZURE_VISION_KEY to enable real image analysis
2. **Important**: Set up Azure Content Safety for production safety
3. **Later**: Configure AI Search for advanced scheme matching
4. **Optional**: Azure Translator for better multi-language support

---

## Support

For issues or questions:
1. Check browser console for error messages
2. Review API logs in terminal
3. Verify all environment variables are set correctly
4. Test with demo mode first (no keys required)
