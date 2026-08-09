import { Alert, Platform } from "react-native";

type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
};

export function showAlert(
  title: string,
  message?: string,
  buttons?: AlertButton[],
) {
  if (Platform.OS === "web") {
    const fullMessage = message ? `${title}\n\n${message}` : title;

    if (!buttons || buttons.length <= 1) {
      window.alert(fullMessage);
      buttons?.[0]?.onPress?.();
      return;
    }

    // Cas confirmation : deux boutons (ex: CANCEL / DELETE ACCOUNT)
    // window.confirm() ne gère que 2 choix (OK/Annuler), donc on
    // mappe le bouton "destructive" ou non-cancel sur OK, et le
    // "cancel" sur Annuler.
    const confirmButton =
      buttons.find((b) => b.style === "destructive") ??
      buttons.find((b) => b.style !== "cancel");
    const cancelButton = buttons.find((b) => b.style === "cancel");

    const confirmed = window.confirm(fullMessage);
    if (confirmed) {
      confirmButton?.onPress?.();
    } else {
      cancelButton?.onPress?.();
    }
  } else {
    Alert.alert(title, message, buttons);
  }
}
