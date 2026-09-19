import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useAtomValue, useSetAtom } from "jotai";

import apiClient from "@/lib/apiClient";
import { toastUserError } from "@/lib/userError";
import ChatHistoryDialog from "@/components/ChatHistoryDialog";
import PromptSuggestions from "@/components/PromptSuggestions";
import { AIInputWithSearch } from "@/components/ui/ai-input-with-search";
import {
  isDeepResearchModeAtom,
  searchModeAtom,
  defaultImageModel,
  webSearchEnabledAtom,
  currentModelAtom,
} from "@/config/state";
import { applyWebSearchForSelectedModel } from "@/lib/models";

import "react-lazy-load-image-component/src/effects/blur.css";

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const setSearchMode = useSetAtom(searchModeAtom);
  const setIsDeepResearchMode = useSetAtom(isDeepResearchModeAtom);
  const setWebSearchEnabled = useSetAtom(webSearchEnabledAtom);
  const currentModel = useAtomValue(currentModelAtom);
  const searchMode = useAtomValue(searchModeAtom);
  const webSearchEnabled = useAtomValue(webSearchEnabledAtom);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const { gpt } = location.state || {};
  useEffect(() => {
    setIsDeepResearchMode(false);
    applyWebSearchForSelectedModel(currentModel, {
      searchMode,
      setWebSearchEnabled,
      setSearchMode,
    });
  }, []);

  const onSubmit = async (
    message,
    withWebSearch,
    images = [],
    files = [],
    options = null,
    gptId = null
  ) => {
    if (!message?.trim() && images.length === 0 && files.length === 0) return;

    const { data, ok } = await apiClient.post("/chats", {
      gptId: gptId || gpt?.id,
    });

    if (!ok) return toastUserError(data?.message, "خطا در ایجاد چت");

    navigate(`/chat/${data.chat.id}`, {
      state: {
        firstMessage: message,
        firstImages: images,
        firstFiles: files,
        firstWithWebSearch: withWebSearch,
        firstImageGeneration: options?.isImageGeneration ? options : null,
        gpt,
      },
    });
  };

  return (
    <div className="flex flex-col pt-4">
      <PromptSuggestions
        onSelectPrompt={(prompt, images = [], gptId = null) => {
          if (prompt?.type === "image") {
            return onSubmit(prompt.prompt, false, [], [], {
              isImageGeneration: true,
              imageModel: defaultImageModel,
            });
          }

          onSubmit(prompt, webSearchEnabled, images, [], gptId);
        }}
      />

      <div id="selected-gpt" className="w-full px-2">
        <h1 className="text-lg mb-3 text-center text-muted-foreground">
          {!!gpt && (
            <div className="flex items-center justify-center gap-2">
              <LazyLoadImage
                src={gpt.image}
                alt={gpt.name}
                className="w-12 h-12 rounded-full"
                effect="blur"
                placeholderSrc="/img-placeholder.jpg"
              />
              <span>{gpt.name}</span>
            </div>
          )}
        </h1>

        <AIInputWithSearch
          onSubmit={(message, withWebSearch, images, files, options) => {
            onSubmit(message, withWebSearch, images, files, options);
          }}
          className="bottom-14"
          isStreaming={false}
          disabled={false}
          gpt={gpt}
          setIsHistoryOpen={setIsHistoryOpen}
          hasHistory={true}
        />
      </div>
      {/* Chat History Dialog */}
      <ChatHistoryDialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen} />
    </div>
  );
}

export default HomePage;
