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
      if (shareError?.name === "AbortError") return; // annulation volontaire
      if (shareError?.name === "NotAllowedError") {
        // Le navigateur a "perdu" le geste utilisateur (délai de capture trop long).
        // On bascule silencieusement sur le téléchargement plutôt que de faire échouer le partage.
        await downloadImage(tempUri, fileName);
        return;
      }
      throw shareError;
    }
  }
  await downloadImage(tempUri, fileName);
}
async function downloadImage(uri: string, fileName: string) {
  const response = await fetch(uri);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}
