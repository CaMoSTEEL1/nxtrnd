import { createWriteStream, promises as fs } from "fs";
import path from "path";
import { tmpdir } from "os";

/**
 * Video composition utility using FFmpeg
 * Combines: influencer video + product shots + voiceover + captions
 * Output: 9:16 vertical video, 30 seconds max
 */

export interface CompositionInput {
  influencerVideoUrl: string;
  voiceoverUrl: string;
  productName: string;
  scriptAngle: string;
  captions?: string[];
}

/**
 * Mock caption generation - creates SRT subtitle format
 */
function generateCaptions(script: string): string {
  const lines = script.split(". ");
  const duration = lines.length > 0 ? Math.floor(30000 / lines.length) : 5000;

  let srt = "";
  lines.forEach((line, i) => {
    if (line.trim()) {
      const startMs = i * duration;
      const endMs = (i + 1) * duration;

      const startTime = msToTime(startMs);
      const endTime = msToTime(endMs);

      srt += `${i + 1}\n${startTime} --> ${endTime}\n${line.trim().substring(0, 100)}\n\n`;
    }
  });

  return srt;
}

function msToTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")},${String(milliseconds).padStart(3, "0")}`;
}

/**
 * Mock video composition
 * In production, use fluent-ffmpeg to compose:
 * 1. Scale influencer video to 9:16
 * 2. Overlay product image (10% duration)
 * 3. Compose with voiceover
 * 4. Add captions from SRT
 * 5. Output final MP4
 */
export async function composeVideo(input: CompositionInput): Promise<string> {
  try {
    // In production with FFmpeg available:
    // const tempDir = tmpdir();
    // const outputPath = path.join(tempDir, `video-${Date.now()}.mp4`);
    // const captionSrt = generateCaptions(input.productName + " " + input.scriptAngle);
    // const captionPath = path.join(tempDir, `captions-${Date.now()}.srt`);
    // await fs.writeFile(captionPath, captionSrt);

    // Run FFmpeg composition command:
    // ffmpeg -i <influencer_video> -i <voiceover> \
    //   -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2[v1];[v1]subtitles=<captionSrt>[vf]" \
    //   -map "[vf]" -map 1:a -c:v libx264 -crf 23 -t 30 <output_file>

    // For now, return a mock composition URL
    const mockVideoUrl = `data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yavZmaXJlYXJhAA==`;

    console.log(
      `[Composition] Created video: ${input.productName} (${input.scriptAngle})`
    );
    console.log(`[Composition] Voiceover: ${input.voiceoverUrl.substring(0, 50)}...`);

    return mockVideoUrl;
  } catch (err) {
    console.error("Video composition failed:", err);
    throw new Error(
      `Video composition error: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }
}

/**
 * Real FFmpeg composition with fluent-ffmpeg
 * Requires: npm install fluent-ffmpeg
 */
export async function composeVideoWithFFmpeg(
  input: CompositionInput
): Promise<string> {
  try {
    // This requires:
    // 1. FFmpeg CLI installed on system
    // 2. fluent-ffmpeg npm package
    // 3. Temporary file system access

    // Example implementation (commented out - requires ffmpeg):
    /*
    const ffmpeg = require('fluent-ffmpeg');
    const tempDir = tmpdir();
    const outputPath = path.join(tempDir, `video-${Date.now()}.mp4`);
    const captionSrt = generateCaptions(input.productName);
    const captionPath = path.join(tempDir, `captions-${Date.now()}.srt`);
    
    await fs.writeFile(captionPath, captionSrt);

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(input.influencerVideoUrl)
        .input(input.voiceoverUrl)
        .complexFilter([
          "[0:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2[v1]",
          `[v1]subtitles='${captionPath}'[vf]`,
        ])
        .outputOptions([
          "-map", "[vf]",
          "-map", "1:a",
          "-c:v", "libx264",
          "-crf", "23",
          "-t", "30",
        ])
        .output(outputPath)
        .on("end", () => resolve(outputPath))
        .on("error", reject)
        .run();
    });
    */

    console.warn(
      "[Composition] FFmpeg not available - returning mock composition"
    );
    return composeVideo(input);
  } catch (err) {
    console.error("FFmpeg composition failed:", err);
    throw err;
  }
}
