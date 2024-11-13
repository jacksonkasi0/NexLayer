import { h } from 'preact';
import { useState, useRef } from 'preact/hooks';

// ** import figma utilities & UI components
import { Button, Container, Stack, Text, TextboxMultiline, useInitialFocus, VerticalSpace } from '@create-figma-plugin/ui';

// ** import store & hooks
import { useStore } from '@nanostores/preact';
import { layerCount } from '@/store/use-layer-structure-store';

// ** import lib
import notify from '@/lib/notify';

const Page = () => {
  const count = useStore(layerCount);

  const [contextValue, setContextValue] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ** Event Handlers
  function handleInput() {
    if (textareaRef.current) {
      setContextValue(textareaRef.current.value);
    }
  }

  function handleGenerateContext() {
    console.log("Generate Context clicked");
    // Placeholder for actual context generation functionality
  }

  function handleRenameLayer() {
    if (count === 0) {
      notify.warn("No layers selected for renaming. Please select a layer.");
      return;
    }
    console.log("Rename Layer clicked");
    // Placeholder for actual layer renaming functionality
  }

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
