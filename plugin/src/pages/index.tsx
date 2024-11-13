import { h } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';

// ** import figma utilities & UI components
import { emit, on } from '@create-figma-plugin/utilities';
import { Button, Container, Stack, Text, TextboxMultiline, useInitialFocus, VerticalSpace } from '@create-figma-plugin/ui';

// ** import store & hooks
import { useStore } from '@nanostores/preact';
import { layerCount, layerStructure } from '@/store/use-layer-structure-store';

// ** import lib
import notify from '@/lib/notify';

// ** import types & enums
import { FetchImageTrigger } from '@/types/enums';
import { ExportCompleteHandler, FetchImageHandler } from '@/types/events';

const Page = () => {
  const count = useStore(layerCount);
  const layers = useStore(layerStructure);

  const [contextValue, setContextValue] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ** Event Handlers
  function handleInput() {
    if (textareaRef.current) {
      setContextValue(textareaRef.current.value);
    }
  }

  function handleGenerateContext() {
    if (count === 0) {
      notify.warn("No layers selected for context generation. Please select a layer.");
      return;
    }
    const parentLayerId = layers[0]?.id; // Take the ID of the first (parent) layer in layers
    if (parentLayerId) {
      emit<FetchImageHandler>('FETCH_IMAGE', parentLayerId, FetchImageTrigger.GenerateContext); // Emit request to export the selected node by parent ID
    } else {
      notify.warn("No parent layer found.");
    }
  }

  function handleRenameLayer() {
    if (count === 0) {
      notify.warn("No layers selected for renaming. Please select a layer.");
      return;
    }

    if (contextValue) {
      console.log("Rename Layer clicked");
    } else {
      const parentLayerId = layers[0]?.id;
      if (parentLayerId) {
        emit<FetchImageHandler>('FETCH_IMAGE', parentLayerId, FetchImageTrigger.RenameLayer);
      }
    }
  }

  // ** Listen for received image data, then log message if handleRenameLayer was triggered without context
  useEffect(() => {
    on<ExportCompleteHandler>('RECEIVE_IMAGE', (imageData, trigger) => {
      console.log("Received image data:", imageData); // Log received image data
      if (trigger === FetchImageTrigger.RenameLayer) {
        console.log("Rename Layer clicked");
      } else {
        console.log("Auto Generate Context clicked");
      }
    });
  }, []);

  return (
    <Container space='small'>
      <VerticalSpace space='extraSmall' />
      <Stack space='medium'>
        <Stack space='extraSmall'>
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

        <Button fullWidth onClick={handleGenerateContext}>
          Auto Generate Context
        </Button>

        <Button fullWidth onClick={handleRenameLayer}>
          Rename {count} Layer{count !== 1 ? 's' : ''}
        </Button>
      </Stack>
    </Container>
  );
};

export default Page;
