import React, { useState } from "react";
import { useAtom } from "jotai";
import { ChevronDown } from "lucide-react";

import openaiImg from "@/assets/img/openai.png";
import anthropicImg from "@/assets/img/anthropic.jpg";
import googleImg from "@/assets/img/google.png";
import xaiImg from "@/assets/img/xai.png";
import perplexityImg from "@/assets/img/pplx.png";
import nubeImg from "@/assets/img/nube.svg";
import { currentModelAtom, chatModelsAtom, defaultAiModel } from "@/config/state";
import { cn } from "@/lib/utils";
import ModelSelectorDialog from "./ModelSelectorDialog";
import { findModelInList } from "@/lib/models";
import hamdastImg from "/logo.png";

const providerImages = {
  openai: openaiImg,
  anthropic: anthropicImg,
  google: googleImg,
  xai: xaiImg,
  hamdast: hamdastImg,
  perplexity: perplexityImg,
  nube: nubeImg,
};

function ChangeActiveModelButton({ disabled = false }) {
  const [currentModel] = useAtom(currentModelAtom);
  const [models] = useAtom(chatModelsAtom);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);

  const modelDetails =
    findModelInList(models, currentModel) || currentModel || defaultAiModel;
  const providerKey = modelDetails?.provider?.toLowerCase?.() || "hamdast";

  return (
    <>
      <button
        onClick={() => setIsModelSelectorOpen(true)}
        className="flex flex-row-reverse items-center px-2 py-1 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all shadow-sm hover:shadow-md group"
        disabled={disabled}
      >
        <img
          src={providerImages[providerKey] || providerImages.hamdast}
          alt={modelDetails.provider}
          className={cn(
            "w-5 h-5 rounded",
            ["openai", "xai"].includes(providerKey) && "bg-white",
          )}
        />

        <div className="flex flex-col items-start ml-2">
          <span className="text-[12px] font-semibold text-foreground">
            {modelDetails.name}
          </span>
        </div>

        <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors ml-2" />
      </button>

      <ModelSelectorDialog
        open={isModelSelectorOpen}
        onOpenChange={setIsModelSelectorOpen}
      />
    </>
  );
}

export default ChangeActiveModelButton;
