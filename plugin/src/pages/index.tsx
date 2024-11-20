import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

// ** import figma utilities & UI components
import { emit, on } from "@create-figma-plugin/utilities";
import {
  Button,
  Container,
  Stack,
  Text,
  TextboxMultiline,
  useInitialFocus,
  VerticalSpace,
} from "@create-figma-plugin/ui";

// ** import store & hooks
import { useStore } from "@nanostores/preact";
import { layerCount, layerStructure } from "@/store/use-layer-structure-store";

// ** import lib
import notify from "@/lib/notify";

// ** import types & enums
import { FetchImageTrigger } from "@/types/enums";
import { ExportCompleteHandler, FetchImageHandler, RenameNodesHandler } from "@/types/events";

// ** import API functions
import { analyzeImage, renameLayers } from "@/api/layersApi";
import { ImageData } from "@/types/utils";

const Page = () => {
  const count = useStore(layerCount);
  const layers = useStore(layerStructure);

  const [contextValue, setContextValue] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ** Button Loading States
  const [isGeneratingContext, setIsGeneratingContext] = useState(false);
  const [isRenamingLayers, setIsRenamingLayers] = useState(false);

  // ** Event Handlers
  function handleInput() {
    if (textareaRef.current) {
      setContextValue(textareaRef.current.value);
    }
  }

  const handleImageData = async (data: ImageData, trigger: FetchImageTrigger) => {
    if (trigger === FetchImageTrigger.RenameLayer) {
      console.log("Rename Layer clicked");
    } else {
      console.log("Auto Generate Context clicked");
    }

    try {
      if (!data) {
        notify.warn(
          "No image data received. Please select a layer and try again.",
        );
        return;
      }

      const formData = new FormData();
      const blob = new Blob([new Uint8Array(data.imageData)], {
        type: "image/jpeg",
      });
      formData.append("file", blob, `${data.nodeName}.jpg`);

      setIsGeneratingContext(true);
      const response = await analyzeImage(formData);
      setIsGeneratingContext(false);

      if (response.success) {
        setContextValue(response.data.content); // Update contextValue with API response
        notify.success("Context generated successfully.");
      } else {
        notify.warn("Failed to generate context. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleGenerateContext:", error);
      setIsGeneratingContext(false);
      notify.error("Failed to generate context. See logs for details.");
    }
  };

  function handleGenerateContext() {
    if (count === 0) {
      notify.warn(
        "No layers selected for context generation. Please select a layer.",
      );
      return;
    }
    const parentLayerId = layers[0]?.id; // Take the ID of the first (parent) layer in layers
    if (parentLayerId) {
      emit<FetchImageHandler>(
        "FETCH_IMAGE",
        parentLayerId,
        FetchImageTrigger.GenerateContext,
      ); // Emit request to export the selected node by parent ID
    } else {
      notify.warn("No parent layer found.");
    }
  }

  async function handleRenameLayer() {
    if (count === 0) {
      notify.warn("No layers selected for renaming. Please select a layer.");
      return;
    }

    try {
      setIsRenamingLayers(true);
      const response = await renameLayers({ context: contextValue, layers });
      setIsRenamingLayers(false);

      if (response.success) {
        notify.success("Layers renamed successfully.");
        console.log("Renamed layers:", response.data);

        // Emit rename nodes event with renamed layers
        emit<RenameNodesHandler>("RENAME_NODES", response.data);
      } else {
        notify.warn("Failed to rename layers. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleRenameLayer:", error);
      setIsRenamingLayers(false);
      notify.error("Failed to rename layers. See logs for details.");
    }
  }

  // ** Listen for received image data
  useEffect(() => {
    on<ExportCompleteHandler>("RECEIVE_IMAGE", handleImageData);
  }, []);

  return (
    <Container space="small">
      <VerticalSpace space="extraSmall" />
      <Stack space="medium">
        <Stack space="extraSmall">
          <Text>Context (optional)</Text>
          <TextboxMultiline
            ref={textareaRef}
            onInput={handleInput}
            value={contextValue}
            {...useInitialFocus()}
            variant="border"
            placeholder="Describe what's inside this selected block"
            rows={5}
          />
        </Stack>

        <Button
          fullWidth
          disabled={!!contextValue || isGeneratingContext}
          onClick={handleGenerateContext}
          loading={isGeneratingContext}
        >
          Auto Generate Context
        </Button>

        <Button
          fullWidth
          disabled={!contextValue || isRenamingLayers}
          onClick={handleRenameLayer}
          loading={isRenamingLayers}
        >
          Rename {count} Layer{count !== 1 ? "s" : ""}
        </Button>
      </Stack>
    </Container>
  );
};

export default Page;
