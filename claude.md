# AI Influencer Content Generator for Sports Brands
## ATDC Challenge: Build the Future of Automated Content

### Project Overview
Build an agentic system that generates short-form video content (TikToks, Reels, 30sec max) featuring AI-generated influencers showcasing sports brand products. The system should automate ideation, scripting, avatar generation, voiceover, and video composition.

**Target Use Case**: B2B for brands looking to have UGC content for their products (Nike, Lululemon, supplement companies, athleisure startups) who want to generate authentic-looking influencer content at scale without paying traditional influencers.

---

## Core Features

### 1. Product Upload & Brand Brief
- User uploads product images (clothing, shoes, supplements, equipment)
- Inputs brand voice/tone (casual, professional, hype, educational)
- Selects target demographic (gym bros, fit girls, runners, lifestyle)
- Optional: reference photo for consistent influencer aesthetic

### 2. AI Influencer Generation
- Generate consistent AI influencer persona (face, body, style)
- Store influencer profile in Supabase for multi-video consistency
- Support multiple influencer archetypes (fit girl, gym bro, runner, etc.)

### 3. Script Generation (Claude API)
- Claude generates 3 script options based on product + brand voice
- Scripts include:
  - Hook (first 3 seconds—attention-grab)
  - Product benefit statement (pain point → solution)
  - Call-to-action
  - Exact timing/word count for voiceover sync
- Each script tagged with key moments for visual transitions

### 4. Video Composition
- Compose: AI influencer video + product showcase + voiceover + captions + transitions
- Auto-generate captions from script
- Add product watermark/branding elements
- Vertical format (9:16 aspect ratio)
- 30-second max duration

### 5. Batch Processing
- Upload CSV with 10+ products → generate videos for all
- Queue management + progress tracking
- Output gallery with preview + download links

---

## Tech Stack

### Frontend
- **Next.js** (App Router)
- **React** for UI components
- **TailwindCSS** for styling
- **shadcn/ui** for polished components
- **Framer Motion** for animations (optional, for polish)

### Backend
- **Next.js API Routes** (serverless functions)
- **Claude API** (claude-opus-4-6 for script generation)
- **Supabase** (PostgreSQL for data + Storage for media assets)

### Video Generation & Processing
- **ComfyUI** (image-to-video generation for AI influencer content)
  - Workflow: Product image → AI influencer pose/product placement → Video generation
  - Models: Flux img2vid, CogVideoX, or AnimateDiff for consistent character
- **ElevenLabs API** (text-to-speech voiceover)
- **FFmpeg** (video composition, captions, transitions, sync)

### Services & APIs
- **Replicate** or **Stability AI** (product image enhancement if needed)
- **Pexels/Pixabay** (optional B-roll fallback)

---

## Database Schema (Supabase)

### `influencer_personas`
```sql
CREATE TABLE influencer_personas (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  name VARCHAR(255),
  archetype VARCHAR(50), -- 'fit_girl', 'gym_bro', 'runner', etc.
  reference_photo_url TEXT, -- Optional: user-uploaded reference
  ai_description TEXT, -- Detailed prompt for AI generation (for ComfyUI)
  comfyui_workflow_json TEXT, -- Saved ComfyUI workflow config
  style_notes TEXT, -- Voice tone, mannerisms, vibe
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### `video_projects`
```sql
CREATE TABLE video_projects (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  project_name VARCHAR(255),
  brand_voice VARCHAR(255), -- 'casual', 'professional', 'hype'
  target_demographic VARCHAR(255),
  influencer_persona_id UUID REFERENCES influencer_personas(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### `video_generations`
```sql
CREATE TABLE video_generations (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES video_projects(id),
  product_image_url TEXT,
  script_option INT, -- 1, 2, or 3
  script_text TEXT,
  voiceover_url TEXT,
  video_status VARCHAR(50), -- 'pending', 'generating', 'completed', 'failed'
  video_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## API Endpoints

### Influencer Management
- `POST /api/influencers/create` — Create new influencer persona
- `GET /api/influencers/[id]` — Fetch influencer details
- `GET /api/influencers/list` — List all influencers for user

### Project Management
- `POST /api/projects/create` — Create new video project
- `GET /api/projects/[id]` — Fetch project details
- `GET /api/projects/list` — List all projects

### Script Generation
- `POST /api/scripts/generate` — Claude generates 3 script options
  - Input: `{ product_description, brand_voice, target_demographic }`
  - Output: `{ scripts: [{ text, wordCount, timing }] }`

### Video Generation
- `POST /api/videos/generate` — Queue video generation
  - Input: `{ projectId, productImageUrl, scriptText, influencerPersonaId }`
  - Output: `{ videoId, status, estimatedTime }`
- `GET /api/videos/[id]/status` — Check video generation progress

### Batch Processing
- `POST /api/batch/upload-csv` — Upload CSV with product/script data
- `GET /api/batch/[batchId]/status` — Monitor batch job progress

---

## Claude Chain Architecture

### Chain 1: Script Generation
```
INPUT: Product description + Brand voice + Demographics
  ↓
[Claude] Generate 3 completely different angles:
  1. Pain-point solve (e.g., "this shoe finally fixed my ankle")
  2. Lifestyle/aspirational (e.g., "this is what champions wear")
  3. Social proof/testimonial (e.g., "every runner I know uses this")
  ↓
Each script includes:
  - Hook (3-5 seconds, must grab attention)
  - Body (product benefits, features, story)
  - CTA (action the audience should take)
  - Timing breakdown (seconds per section)
  - Word count (for VO pacing)
  ↓
OUTPUT: 3 ready-to-use scripts with metadata
```

### Chain 2: Visual Direction
```
INPUT: Script + Product image
  ↓
[Claude] Generate visual descriptions for key moments:
  - Opening shot: influencer reaction to product
  - Product showcase: close-up of details, styling
  - Transition moments: where to cut/change scenes
  - Ending: CTA visual (product in hand, lifestyle shot)
  ↓
OUTPUT: Shot list with timing + visual prompts for video composition
```

### Chain 3: Voiceover Direction
```
INPUT: Script + Influencer persona (tone, age, background)
  ↓
[Claude] Generate voice direction:
  - Tone (conversational, energetic, authoritative)
  - Pacing (fast = hype, slow = educational)
  - Emotion (excited, confident, relatable)
  - Inflection notes (emphasis on benefits, CTA)
  ↓
OUTPUT: ElevenLabs voice params + delivery notes
```

---

## Video Composition Logic (ComfyUI + FFmpeg)

### ComfyUI Workflow (Image-to-Video)
**Goal**: Convert product image + influencer pose prompt → motion video

**Workflow Steps**:
1. **Input**: Product image + Script visual direction
2. **Load checkpoint**: FLUX img2vid or CogVideoX model
3. **Prepare prompt**: Claude generates detailed motion description
   - Example: "A fit woman in athletic wear, smiling and holding a Nike shoe, turning it to show detail, 4 seconds, smooth camera motion"
4. **Run generation**: ComfyUI processes → outputs mp4 with motion
5. **Output**: 4-6 second video of influencer with product

### ComfyUI Node Chain
```
[Load Image] (product + influencer reference)
    ↓
[Clip Text Encode] (Claude-generated prompt: motion + product details)
    ↓
[Load Model] (FLUX img2vid or CogVideoX)
    ↓
[KSampler] (generate video frames)
    ↓
[Video Combine] (convert frames to mp4)
    ↓
[VHS Video Combine] (output final video)
```

### Integration with Backend
- **Option A**: Run ComfyUI locally (on your server/machine)
  - Requires GPU (RTX 4090, A100, or similar)
  - Full control, no API costs
  - Best for batch processing
  
- **Option B**: Call ComfyUI API (if self-hosted with API endpoint)
  - Queue workflow via HTTP POST
  - Poll for completion
  - Monitor GPU utilization

- **Option C**: Replicate (hosted ComfyUI)
  - Send workflow → Replicate runs it on their GPU
  - Pay per generation (~$0.50-2.00)
  - Simplest integration, scalable

### Backend Integration Flow
```
POST /api/videos/generate
  ↓
[Queue video job]
  ↓
[Call ComfyUI API] with:
  - ComfyUI workflow JSON
  - Product image URL
  - Visual prompt (from Claude)
  - VO timing
  ↓
[Poll for completion]
  ↓
[Download video output]
  ↓
[Proceed to FFmpeg composition]
```

### FFmpeg Final Composition
```bash
ffmpeg \
  -i influencer_video.mp4 \      # ComfyUI output
  -i voiceover.mp3 \              # ElevenLabs VO
  -filter_complex "[0:v]scale=1080:1920[v];[v]subtitles=captions.srt[vf]" \
  -map "[vf]" -map "1:a" \
  -c:v libx264 -preset fast \
  -c:a aac -b:a 128k \
  output_vertical_video.mp4
```

### Steps:
1. **Get ComfyUI-generated video** (influencer + product, 4-6 seconds)
2. **Generate voiceover** with ElevenLabs (from script + voice direction)
3. **Sync audio to video** (FFmpeg audio overlay, extend/speed up video if needed)
4. **Generate captions** from script (timed subtitles)
5. **Compose final video**:
   - Main track: ComfyUI influencer video
   - Audio: voiceover (synced to video length)
   - Overlay: captions (bottom third, branded style)
   - Transitions: fade between clips if multi-scene
   - Watermark: brand logo (top right or bottom)
6. **Export**: 9:16 aspect ratio, H.264 codec, optimized for social (under 100MB)

---

## Frontend Components (Rough Structure)

### Pages
- `/` — Dashboard (project overview, recent videos)
- `/create` — New project wizard
  - Step 1: Upload products + brand brief
  - Step 2: Select/create influencer persona
  - Step 3: Generate scripts (see 3 options)
  - Step 4: Customize script
  - Step 5: Preview + Generate video
- `/projects/[id]` — Project detail (videos, scripts, settings)
- `/influencers` — Manage influencer personas
- `/gallery` — Browse all generated videos

### Key Reusable Components
- `ProductUploader` (drag-and-drop images)
- `ScriptViewer` (display 3 options, select one)
- `VideoPreview` (play final video inline)
- `BatchUploader` (CSV import for bulk generation)
- `ProgressBar` (video generation status)

---

## Influencer Image Generation (Quality-First Approach)

### Strategy: DALL-E 3 for High-Fidelity AI Influencer Images

**Why DALL-E 3**:
- ✅ Highest quality photorealistic faces (professional, authentic-looking)
- ✅ Best prompt understanding (complex, nuanced descriptions work)
- ✅ Most reliable for B2B use case (brands trust the look)
- ✅ Built-in safety guardrails (no deepfake concerns)
- ⏱️ Speed is secondary (willing to wait 20-30 sec per image for quality)
- 💰 ~$0.20 per image (acceptable for high-quality output)

**Note on Face Consistency**: Will be addressed in Phase 3+ using ControlNet/IP-Adapter. For MVP, focus on generating stunning individual images.

### Image Generation Pipeline

```
Step 1: Create Influencer Persona (One-time per brand)
  ↓
[Claude API] Generate detailed persona description
  Input: Brand voice, target demographic, sport/activity
  Output: Vivid character description
  
  ↓
[DALL-E 3] Generate high-quality portrait
  Input: Persona description + style guidelines
  Output: High-fidelity portrait image (1024x1024)
  
  ↓
[Supabase] Store persona + portrait reference

Step 2: Generate Product-Specific Images (Per video)
  ↓
[Claude API] Write product-specific visual prompt
  Input: Persona + Product details + Brand voice
  Output: Detailed prompt with pose, setting, product placement
  
  ↓
[DALL-E 3] Generate product-specific image
  Input: Product prompt (high detail)
  Output: High-fidelity image (1024x1024) ready for ComfyUI
  
  ↓
[Supabase] Store generated image + metadata
```

### Claude Chain: Persona Description Generation

**System Prompt**:
```
You are an expert persona designer for AI influencers. 
Generate a vivid, photorealistic character description optimized for DALL-E 3.
Include: age, skin tone, body type, clothing style, expression, 
lighting preference, background aesthetic, and overall vibe.
Output valid JSON.
```

**Input Example**:
```json
{
  "brand": "Nike",
  "sport": "running",
  "demographic": "women 18-35",
  "tone": "energetic, aspirational, authentic"
}
```

**Output Example**:
```json
{
  "persona_name": "Alex Chen",
  "description": "26-year-old East Asian woman with athletic, lean build. 
    Warm brown skin, confident and energetic expression. Sleek high ponytail, 
    natural makeup, minimal jewelry. Wearing a white minimalist sports bra and 
    black leggings. Studio setting with soft diffused lighting from professional 
    lighting kit. Clean white background. Professional headshot pose. 
    Instagram influencer aesthetic, magazine cover quality lighting. 
    Approachable yet aspirational vibe. Natural and authentic presence.",
  "demographics": {
    "age": 26,
    "gender": "woman",
    "ethnicity": "East Asian",
    "body_type": "athletic, lean"
  },
  "style_attributes": {
    "clothing": "minimalist athletic wear, earth tones",
    "aesthetic": "Instagram influencer, fitness professional",
    "vibe": "energetic but relatable, aspirational"
  }
}
```

### Claude Chain: Product Image Prompt Generation

**System Prompt**:
```
You are a professional product photography director. Generate a detailed 
visual prompt for DALL-E 3 that shows an AI influencer naturally using or 
showcasing a product. The result should look like professional product 
photography, not a casual snapshot. Be specific about: pose, hand placement, 
facial expression, setting, lighting, and overall composition.
```

**Input Example**:
```
Influencer: 26-year-old athletic woman, energetic expression, white sports bra...
Product: Nike Air Zoom Pegasus running shoe
Category: running shoe
Features: lightweight, responsive cushioning, sleek design
Script moment: "Finally found a shoe that keeps up with my pace"
Brand Voice: energetic, performance-focused, inspirational
```

**Output Example**:
```
The athletic woman confidently holding the Nike running shoe at chest level, 
turning slightly to show the side profile and sleek design. Genuine smile, 
eyes showing determination and confidence. Shoe logo clearly visible. 
Modern minimalist gym setting with industrial aesthetic. Soft box lighting 
from professional studio setup, creating definition without harsh shadows. 
Clean white background with subtle depth. Shot from waist up, professional 
product photography style. Natural hand positioning, fingers gently cradling 
the shoe's curves. Energetic but polished aesthetic. Magazine-quality 
composition. Sharp focus on both influencer's expression and product details.
```

### Backend Implementation: Image Generation Endpoints

#### `POST /api/images/generate-persona`
Creates a new AI influencer persona with DALL-E 3 portrait.

```javascript
async function generatePersona(brandBrief) {
  // Step 1: Claude generates vivid persona description
  const personaDescription = await generatePersonaDescription(brandBrief);

  // Step 2: DALL-E 3 generates high-quality portrait
  const portraitUrl = await generatePortrait(personaDescription.description);

  // Step 3: Store in Supabase
  const persona = await supabase
    .from("influencer_personas")
    .insert({
      user_id: brandBrief.user_id,
      name: personaDescription.persona_name,
      description: personaDescription.description,
      reference_image_url: portraitUrl,
      base_prompt_template: personaDescription.description,
      style_notes: JSON.stringify(personaDescription.style_attributes),
    })
    .select()
    .single();

  return {
    id: persona.id,
    name: persona.name,
    portraitUrl: portraitUrl,
    description: persona.description,
  };
}

async function generatePersonaDescription(brandBrief) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
    },
    body: JSON.stringify({
      model: "claude-opus-4-20250514",
      max_tokens: 1500,
      system: `You are an expert persona designer for AI influencers. 
        Generate a vivid, photorealistic character description optimized 
        for DALL-E 3 image generation. Be specific about physical details, 
        clothing, style, aesthetic, and vibe. Return valid JSON only.`,
      messages: [
        {
          role: "user",
          content: `Create an AI influencer persona for:
          Brand: ${brandBrief.brand}
          Sport/Category: ${brandBrief.sport}
          Target Demographics: ${brandBrief.demographic}
          Brand Tone: ${brandBrief.tone}
          
          Return JSON with:
          {
            "persona_name": "string",
            "description": "long vivid description for DALL-E 3 (300+ words)",
            "demographics": { age, gender, ethnicity, body_type },
            "style_attributes": { clothing, aesthetic, vibe }
          }`,
        },
      ],
    }),
  });

  const data = await response.json();
  const content = data.content[0].text;
  return JSON.parse(content);
}

async function generatePortrait(personaDescription) {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: `${personaDescription}
    
    TECHNICAL REQUIREMENTS:
    - Photorealistic professional headshot
    - Studio photography with high-end lighting
    - 4K quality, sharp facial details
    - Magazine cover aesthetic
    - Natural makeup, professional styling
    - Clean background, minimal distractions
    - Instagram influencer standard`,
    size: "1024x1024",
    quality: "hd",
    n: 1,
  });

  return response.data[0].url;
}
```

#### `POST /api/images/generate-product`
Generates product-specific images for a given persona.

```javascript
async function generateProductImage(persona, product, scriptExcerpt) {
  // Step 1: Claude generates detailed product-specific prompt
  const productPrompt = await generateProductPrompt(
    persona,
    product,
    scriptExcerpt
  );

  // Step 2: DALL-E 3 generates high-quality product image
  const imageUrl = await generateProductPhoto(productPrompt);

  // Step 3: Store in Supabase
  const productImage = await supabase
    .from("product_images")
    .insert({
      influencer_persona_id: persona.id,
      product_description: product.name,
      generated_image_url: imageUrl,
      generation_model: "dalle3",
      custom_prompt: productPrompt,
    })
    .select()
    .single();

  return {
    id: productImage.id,
    imageUrl: imageUrl,
    personaId: persona.id,
  };
}

async function generateProductPrompt(persona, product, scriptExcerpt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
    },
    body: JSON.stringify({
      model: "claude-opus-4-20250514",
      max_tokens: 1200,
      system: `You are a professional product photography director. 
        Generate a detailed visual prompt for DALL-E 3 that shows an AI influencer 
        naturally using or showcasing a product. The result must look like 
        professional product photography. Be specific about: pose, hand placement, 
        facial expression, setting, lighting, composition, and brand aesthetic.
        Return only the prompt text, optimized for DALL-E 3.`,
      messages: [
        {
          role: "user",
          content: `Create a product photo prompt:
          
          Influencer Persona: ${persona.name}
          Description: ${persona.description}
          
          Product: ${product.name}
          Category: ${product.category}
          Features: ${product.features.join(", ")}
          
          Script Moment: "${scriptExcerpt}"
          Brand Voice: ${product.brandVoice}
          
          Generate a detailed, vivid prompt (300+ words) optimized for DALL-E 3.
          Focus on: natural pose, product visibility, professional lighting,
          clean composition, and authentic influencer interaction with product.`,
        },
      ],
    }),
  });

  const data = await response.json();
  return data.content[0].text;
}

async function generateProductPhoto(prompt) {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: `${prompt}
    
    TECHNICAL REQUIREMENTS:
    - Professional product photography quality
    - Magazine-grade lighting and composition
    - 4K resolution, sharp focus on both influencer and product
    - Commercial aesthetic, clean background
    - Natural shadows and depth, not flat
    - Instagram Reels / TikTok ready quality`,
    size: "1024x1024",
    quality: "hd",
    n: 1,
  });

  return response.data[0].url;
}
```

### Quality Validation Checklist

**Persona Portrait** (before proceeding to product images):
- ✅ Sharp, clear facial features (eyes, smile, expression)
- ✅ Professional studio lighting (soft, no harsh shadows)
- ✅ Natural expression (confident, approachable, not robotic)
- ✅ Matches demographic/ethnicity as described
- ✅ Magazine-cover quality composition
- ✅ Clean background with appropriate depth
- ⚠️ If image fails any check → regenerate with refined prompt

**Product Image** (before feeding to ComfyUI):
- ✅ Product is clearly visible and identifiable
- ✅ Influencer is naturally posed (not awkwardly holding item)
- ✅ Professional lighting hierarchy (product in focus, influencer supporting)
- ✅ Hand positioning looks natural and aspirational
- ✅ Clean composition without distractions
- ✅ Ready for social media (Instagram Reels aesthetic)
- ✅ Influencer expression matches script moment (confident, excited, etc.)
- ⚠️ If image fails → try regenerating with alternative pose/angle prompt

### Cost & Timeline Estimates

- **Persona portrait**: 1 image → ~$0.20 OpenAI cost → ~30 sec generation
- **Product image**: 1 image per product → ~$0.20 each → ~30 sec generation
- **Demo project** (1 persona + 5 products): ~$1.20 total, ~3-4 minutes

### Future Enhancements (Phase 3+)

- Add ControlNet/IP-Adapter for face consistency across product variants
- Implement image caching + reuse for multiple product generations
- Parallel batch generation (queue 5 product images simultaneously)
- A/B test different poses/compositions for same product
- Implement quality scoring (automated validation of generated images)

---

## Implementation Roadmap (Priority Order)

### Phase 1: MVP (Core Loop)
- [ ] Next.js project scaffold + Supabase setup
- [ ] Claude persona description generation (brand → vivid character)
- [ ] DALL-E 3 image generation (persona portraits)
- [ ] Product upload form + DALL-E product image generation
- [ ] Claude script generation (3 options)
- [ ] Voiceover generation (ElevenLabs)
- [ ] Simple video composition (FFmpeg)
- [ ] Basic UI for create flow

### Phase 2: ComfyUI Integration
- [ ] Set up ComfyUI (local or Replicate)
- [ ] Build ComfyUI workflow JSON templates
- [ ] Influencer persona creation + reference photo storage
- [ ] Integrate ComfyUI API calls into backend
- [ ] Test image-to-video generation with sample products
- [ ] Handle ComfyUI polling + error states

### Phase 3: Polish & Scale
- [ ] Batch CSV processing
- [ ] Video gallery + management
- [ ] Download/share functionality
- [ ] Progress tracking & notifications
- [ ] Error handling + retry logic

### Phase 4: Deployment & Demo
- [ ] Deploy to Vercel
- [ ] Create demo project (sample sports brand)
- [ ] Generate 3-5 sample videos
- [ ] Write ATDC submission

---

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

ANTHROPIC_API_KEY=
OPENAI_API_KEY= # For DALL-E 3 image generation
ELEVENLABS_API_KEY=
REPLICATE_API_TOKEN= # If using Replicate for ComfyUI

FFMPEG_PATH= # Local FFmpeg binary path (if needed)
```

---

## Success Criteria for ATDC Submission

1. ✅ **Fully working demo** — Upload product → Get 30-sec video in <2min
2. ✅ **Agentic system** — Claude drives ideation + scripting
3. ✅ **AI influencer** — Consistent persona across multiple videos
4. ✅ **Batch processing** — Show scalability (upload 5 products → 5 videos)
5. ✅ **Professional output** — Videos look polished, ready for TikTok/Reels
6. ✅ **Business angle** — Clear ROI story (cost savings vs. traditional influencers)

---

## Notes for Development

### Key Decisions to Make
1. **ComfyUI Deployment** — Local GPU vs. Replicate API (cost vs. control trade-off)
2. **ComfyUI Model** — FLUX img2vid (fast, good quality) vs. CogVideoX (better motion, slower)
3. **Influencer Reference** — Consistent AI character or generate new for each video
4. **ElevenLabs voice** — Pick 1-2 consistent "influencer" voices per persona
5. **Captions style** — Match brand aesthetic (modern fonts, neon colors for hype, clean for professional)
6. **Stock footage fallback** — ComfyUI as primary, fallback to Pexels/Pixabay if generation fails

### Performance Optimization
- Cache influencer personas (don't regenerate same face)
- Use job queues (Bull or Temporal) for video generation (can take 30-60sec)
- Pre-generate common scripts, reuse where possible
- Compress videos before serving (lower resolution for preview, full res for download)

### Risk Mitigation
- Have fallback video templates if AI generation fails
- Rate limit Claude API calls (budget ~$0.05-0.10 per video generation)
- Test video composition with multiple FFmpeg versions
- Set up error logging + alerting (Sentry)

---

## ComfyUI Workflow Configuration

### Recommended Setup

**Option 1: Local ComfyUI (Best for Control)**
- Hardware: GPU with 24GB+ VRAM (RTX 4090, RTX 6000, A100)
- Installation: Clone ComfyUI repo + install dependencies
- Models to install:
  - `flux-fill-dev` or `flux-dev` (for img2vid)
  - `CogVideoX-5B` or `CogVideoX-2B` (alternative)
  - CLIP/VAE encoders
- API: Expose ComfyUI server on local network or docker container

**Option 2: Replicate API (Easiest Integration)**
- No setup needed, pay-per-use
- Upload ComfyUI workflow JSON
- Replicate runs on their GPU
- Cost: ~$0.50-2.00 per video generation
- Integration: Simple HTTP POST → poll for completion

### Sample ComfyUI Workflow (JSON)
```json
{
  "1": {
    "inputs": {
      "image": ["load_image_node", 0],
      "upload": "product_image.jpg"
    },
    "class_type": "LoadImage"
  },
  "2": {
    "inputs": {
      "text": "a fit woman in athletic gear, holding a Nike shoe, smiling, turning product to camera, bright studio lighting, 4 seconds of smooth motion"
    },
    "class_type": "CLIPTextEncode"
  },
  "3": {
    "inputs": {
      "ckpt_name": "flux-fill-dev.safetensors"
    },
    "class_type": "CheckpointLoader"
  },
  "4": {
    "inputs": {
      "seed": 42,
      "steps": 30,
      "cfg": 7.5,
      "sampler_name": "euler",
      "scheduler": "normal",
      "denoise": 1.0,
      "model": ["3", 0],
      "positive": ["2", 0],
      "negative": ["negative_prompt", 0],
      "latent_image": ["vae_encode", 0]
    },
    "class_type": "KSampler"
  },
  "5": {
    "inputs": {
      "samples": ["4", 0],
      "vae": ["3", 2]
    },
    "class_type": "VAEDecode"
  },
  "6": {
    "inputs": {
      "images": ["5", 0],
      "fps": 24,
      "format": "mp4"
    },
    "class_type": "VHS_VideoCombine"
  },
  "7": {
    "inputs": {
      "filename_prefix": "output/influencer_video",
      "images": ["6", 0]
    },
    "class_type": "SaveImage"
  }
}
```

### Backend Integration (Node.js/Next.js)

**If using Replicate:**
```javascript
import Replicate from "replicate";

async function generateComfyUIVideo(productImageUrl, prompt) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const output = await replicate.run(
    "stability-ai/stable-video-diffusion:3f0457e4619daede4d4c7c280f796eff314bf41fe618c2fc0bb6773aadc51e56",
    {
      input: {
        image: productImageUrl,
        prompt: prompt,
        num_frames: 96, // 4 seconds at 24fps
        fps: 24,
      },
    }
  );

  return output.video; // URL to generated video
}
```

**If using local ComfyUI:**
```javascript
async function generateComfyUIVideo(productImageUrl, prompt) {
  const workflowJson = {
    // ... workflow nodes from above
    "2": {
      "inputs": { "text": prompt }, // Insert Claude-generated prompt
      "class_type": "CLIPTextEncode"
    },
    // ...
  };

  const response = await fetch("http://localhost:8188/prompt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workflowJson),
  });

  const { prompt_id } = await response.json();

  // Poll for completion
  let videoUrl = null;
  while (!videoUrl) {
    const status = await fetch(`http://localhost:8188/history/${prompt_id}`);
    const history = await status.json();

    if (history[prompt_id]) {
      videoUrl = history[prompt_id].outputs.video_path;
    }
    await new Promise(r => setTimeout(r, 2000)); // Poll every 2 seconds
  }

  return videoUrl;
}
```

### Claude Prompt for Visual Direction (ComfyUI)
```
Given this product: ${productDescription}
And this script: ${scriptText}
Generate a detailed ComfyUI prompt for image-to-video generation.

Requirements:
- Describe the influencer (gender, age, style, clothing)
- Describe their action with the product (holding, wearing, demonstrating)
- Include camera movement (pan, zoom, static)
- Lighting and setting (studio, outdoor, bright, moody)
- Duration: 4-6 seconds
- Emotion/tone: (confident, casual, excited, etc.)

Example output:
"A 25-year-old athletic woman in a white sports bra and black leggings, 
confidently holding a Hydro Flask water bottle, turning it to show the logo, 
with smooth camera pan from left to right, bright natural lighting through 
large windows, minimalist gym setting, 4 seconds, energetic and confident"
```
2. Start with Phase 1: Project setup + script generation
3. Test Claude chains locally before integrating APIs
4. Build UI alongside backend (test each API endpoint)
5. Iterate on video quality based on sample outputs

Good luck! This is a strong ATDC submission if executed well. 🚀

---

## Design Context

### Users
**Agency operators** managing UGC content production for multiple sports brand clients. They're running content pipelines, accountable to clients. The job to be done is generating polished, TikTok/Reels-ready AI influencer videos at scale. The interface must feel **organized, scalable, and trustworthy** — both during heads-down workflow and client screen-shares.

### Brand Personality
- **Three words**: Capable, Polished, Scalable
- **Tone**: Professional with creative confidence — not corporate stiff, not startup chaotic.
- **Emotional goal**: Operators should feel *in control of something powerful*. Confidence when generating, clarity when reviewing, satisfaction when delivering.

### Aesthetic Direction
- **Visual tone**: Clean premium SaaS — think Stripe, Notion, Linear light. Light `gray-50`/`white` backgrounds, refined card surfaces, subtle shadows, generous whitespace.
- **Primary palette**: Deep indigo/violet — authoritative, modern, distinct from typical sports-red energy.
- **Theme**: Both light and dark mode with toggle. Light mode default (client-demo-friendly).
- **Typography**: High-contrast clean sans-serif. Strong hierarchy. Labels/metadata in muted tones.
- **Motion**: Purposeful and restrained — Framer Motion page transitions, skeleton loaders during AI generation, alive progress indicators. No gratuitous animation.
- **Anti-pattern**: Avoid neon-gamer aesthetics, heavy gradients, overly bold/athletic styling. This is a *tool for creating* sports content, not a sports brand itself.
- **Radii**: `rounded-xl` cards, `rounded-lg` inputs/buttons.

### Design Principles
1. **Clarity over cleverness** — Every element earns its place. No decorative complexity.
2. **Trust through polish** — Subtle details signal the AI underneath is reliable and production-grade.
3. **Progressive disclosure** — Complex multi-step workflows should feel simple at each step.
4. **Status is sacred** — AI generation states must always be visible, honest, and never anxiety-inducing.
5. **Scale-first layout** — Batch operations and multi-client views are first-class citizens. Design for 10 projects, not 1.
