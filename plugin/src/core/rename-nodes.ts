/**
 * Renames nodes in the Figma document based on the provided data.
 *
 * @param data - An array of objects containing node IDs and new names.
 */
export const handleRenameNodes = async (data: { id: string; n: string }[]): Promise<void> => {
    for (const { id, n } of data) {
      try {
        const node = await figma.getNodeByIdAsync(id); // Asynchronously find the node by ID
        if (!node) {
          console.warn(`Node with ID ${id} not found.`);
          continue;
        }
  
        if ('name' in node) {
          node.name = n; // Rename the node
          console.log(`Renamed node ID ${id} to "${n}".`);
        } else {
          console.warn(`Node with ID ${id} does not support renaming.`);
        }
      } catch (error) {
        console.error(`Failed to rename node with ID ${id}:`, error);
      }
    }
  };
  