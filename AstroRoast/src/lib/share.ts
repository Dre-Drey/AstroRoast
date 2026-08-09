import * as Sharing from "expo-sharing";
import { showAlert } from "../lib/alert";

import * as FileSystem from "expo-file-system/legacy";

export async function shareOnNative(tempUri: string) {
  const fileName = `astro_daily_roast_${Date.now()}.png`;
  const destinationUri = FileSystem.documentDirectory + fileName;

  await FileSystem.copyAsync({
    from: tempUri,
    to: destinationUri,
  });

  if (!(await Sharing.isAvailableAsync())) {
    showAlert("Le partage n'est pas disponible sur votre appareil");
    return;
  }

  await Sharing.shareAsync(destinationUri, {
    mimeType: "image/png",
    dialogTitle: "Share your Daily Roast",
    UTI: "public.png",
  });
}

export async function shareOnWeb(tempUri: string) {
  // On web, captureRef (html2canvas) returns a data URL,
  // not a file path: to convert it to a File, we first convert it to a Blob.
  const response = await fetch(tempUri);
  const blob = await response.blob();
  const fileName = `astro_daily_roast_${Date.now()}.png`;
  const webFile = new globalThis.File([blob], fileName, { type: "image/png" });

  const canShareFiles =
    typeof navigator !== "undefined" &&
    "share" in navigator &&
    "canShare" in navigator &&
    (navigator as any).canShare({ files: [webFile] });

  if (canShareFiles) {
    try {
      await (navigator as any).share({
        files: [webFile],
        title: "My Daily Roast",
      });
      return;
    } catch (shareError: any) {
      // The user canceled the share — not a real error, we just stop here.
      if (shareError?.name === "AbortError") return;
      throw shareError;
    }
  }

  // Fallback desktop : direct download of the image file
  const link = document.createElement("a");
  link.href = tempUri;
  link.download = fileName;
  link.click();
}
