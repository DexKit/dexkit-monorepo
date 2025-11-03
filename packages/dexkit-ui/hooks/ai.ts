import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { useContext } from "react";
import { useEditSiteId } from ".";
import { GenerateImagesContext } from "../context/GenerateImagesContext";
import { AI_MODEL, ImageGenerate, TextImproveAction } from "../types/ai";
import { dataURItoBlob } from "../utils/image";

export function useCompletation() {
  const { editSiteId } = useEditSiteId();
  const { instance } = useDexkitApiProvider();

  return useMutation(
    async ({
      messages,
      action,
      model,
    }: {
      messages: { role: string; content: string }[];
      action?: TextImproveAction;
      model?: AI_MODEL;
    }) => {
      return (
        await instance?.post("/ai/completation", {
          messages,
          action,
          model,
          siteId: editSiteId
        })
      )?.data;
    }
  );
}

export function useImageGenerate() {
  const { instance } = useDexkitApiProvider();
  const { editSiteId } = useEditSiteId();

  const { enqueueSnackbar } = useSnackbar();

  return useMutation(
    async (body: ImageGenerate) => {
      return (await instance?.post("/ai/image/generate", {...body, siteId: editSiteId}))?.data;
    },
    {
      onError: (err) => {
        enqueueSnackbar(String(err), { variant: "error" });
      },
    }
  );
}

export function useSaveImages() {
  const { instance } = useDexkitApiProvider();

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  return useMutation(
    async ({ urls }: { urls: string[] }) => {
      return (await instance?.post("/ai/image/save", { urls }))?.data;
    },
    {
      onSuccess: () => {
        enqueueSnackbar(
          formatMessage({ id: "saved", defaultMessage: "Saved" }),
          { variant: "success" }
        );
      },
      onError: (err) => {
        enqueueSnackbar(String(err), { variant: "error" });
      },
    }
  );
}

export function useGenVariants() {
  const { instance } = useDexkitApiProvider();
  const { editSiteId } = useEditSiteId();
  return useMutation(
    async ({ url, numImages }: { url: string; numImages: number }) => {
      return (await instance?.post("/ai/image/variants", { url, numImages, siteId: editSiteId }))
        ?.data;
    }
  );
}

export function useEditImage() {
  const { instance } = useDexkitApiProvider();
  const { editSiteId } = useEditSiteId();

  return useMutation(
    async ({
      prompt,
      numImages,
      imageUrl,
      maskData,
      model,
    }: {
      numImages: number;
      maskData: string;
      imageUrl: string;
      prompt: string;
      model?: string;
    }) => {
      const form = new FormData();

      const blob = dataURItoBlob(maskData);

      form.append("mask", blob);
      form.append("image", imageUrl);
      form.append("numImages", numImages.toString());
      form.append("prompt", prompt);

      if (model) {
        form.append("model", model);
      }

      return (await instance?.post("/ai/image/edit", {...form, siteId: editSiteId}))?.data;
    }
  );
}

export function useGenerateImageContext() {
  return useContext(GenerateImagesContext);
}
