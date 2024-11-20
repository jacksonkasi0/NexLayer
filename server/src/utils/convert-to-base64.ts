/**
 * Converts a file to a base64-encoded string.
 *
 * @param file - The raw file object.
 * @returns A base64-encoded string representation of the file.
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const base64String = reader.result?.toString().split(",")[1]; // Extract base64 part
            if (base64String) {
                resolve(base64String);
            } else {
                reject(new Error("Failed to convert file to base64."));
            }
        };

        reader.onerror = () => {
            reject(new Error("File reading failed."));
        };

        reader.readAsDataURL(file); // Read file as data URL
    });
};
