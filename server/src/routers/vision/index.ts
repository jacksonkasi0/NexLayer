import { Hono } from "@hono/hono";

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

    // Log file details
    fileList.forEach((file, index) => {
      if (file instanceof File) {
        console.log(`File #${index + 1}:`, {
          name: file.name,
          type: file.type,
          size: file.size,
        });
      } else {
        console.warn(`File #${index + 1} is not a valid File object.`);
      }
    });

    return c.json(
      {
        success: true,
        message: "Files received successfully.",
        fileCount: fileList.length,
      },
      200
    );
  } catch (error) {
    console.error("Error in /upload:", error);
    return c.json(
      {
        success: false,
        message: "Error processing file upload.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});
