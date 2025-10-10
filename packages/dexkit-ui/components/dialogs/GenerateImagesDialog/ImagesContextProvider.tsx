import React, { useCallback, useMemo, useState } from "react";
import { GenerateImagesContext } from "../../../context/GenerateImagesContext";
import { useSaveImages } from "../../../hooks/ai";

export interface ImagesContextProviderProps {
  children: React.ReactNode;
}

export default function ImagesContextProvider({
  children,
}: ImagesContextProviderProps) {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [savedImages, setSavedImages] = useState<string[]>([]);

  const { isLoading: isSavingImages, mutateAsync: saveImages } =
    useSaveImages();

  const addSavedImages = useCallback((urls: string[]) => {
    setSavedImages((images: string[]) => {
      const set = new Set(images);
      for (let url of urls) {
        set.add(url);
      }

      return Array.from(set);
    });
  }, []);

  const addGeneratedImages = useCallback((urls: string[]) => {
    setGeneratedImages((images: string[]) => {
      const set = new Set(images);
      for (let url of urls) {
        set.add(url);
      }

      return Array.from(set);
    });
  }, []);

  const unsavedImages = useMemo(() => {
    return generatedImages.filter((x: string) => !savedImages.includes(x));
  }, [generatedImages, savedImages]);

  const hasUnsavedImages = useMemo(() => {
    return unsavedImages.length > 0;
  }, [unsavedImages]);

  return (
    <GenerateImagesContext.Provider
      value={{
        savedImages,
        generatedImages,
        isSavingImages,
        saveImages,
        addSavedImages,
        hasUnsavedImages,
        unsavedImages,
        addGeneratedImages,
      }}
    >
      {children}
    </GenerateImagesContext.Provider>
  );
}
