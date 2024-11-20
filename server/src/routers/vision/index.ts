import { Hono } from "@hono/hono";

// ** import utils
import { analyzeFigmaFrameDesign } from "@/utils/llm/figma-ocr.ts";

export const visionApi = new Hono();

visionApi.post("/upload", async (c) => {
  try {
    const body = await c.req.parseBody();

    // Extract the files (supporting single or multiple files)
    const files = body["file"] || body["file[]"]; // Handle both single and multiple file inputs
    const fileList = Array.isArray(files) ? files : [files]; // Normalize to array

    // Ensure at least one image file is provided
    if (!fileList.length || !fileList[0]) {
      return c.json(
        {
          success: false,
          message: "At least one image file is required.",
        },
        400
      );
    }

    // Validate all inputs are files
    const validFiles = fileList.filter((file): file is File => file instanceof File);

    if (!validFiles.length) {
      return c.json(
        {
          success: false,
          message: "No valid image files found.",
        },
        400
      );
    }

    // Call the Figma OCR utility
    const analysisResponse = await analyzeFigmaFrameDesign({ files: validFiles });

    return c.json(
      {
        success: true,
        message: "Files analyzed successfully.",
        data: analysisResponse,
      },
      200
    );
  } catch (error) {
    console.error("Error in /upload:", error);
    return c.json(
      {
        success: false,
        message: "Error processing file upload and analysis.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});
