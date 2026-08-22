import { COLORS } from "../constants/theme";
import { StyleSheet } from "react-native";

export const sharedLayout = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    maxWidth: 700,
    alignSelf: "center",
  },
  center: {
    flex: 1,
    backgroundColor: COLORS.void,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: { padding: 20 },
  header: { marginBottom: 40 },
  button: {
    backgroundColor: COLORS.primary,
    padding: 24,
    borderRadius: 0,
    alignItems: "center",
    marginBottom: 100,
  },
  buttonText: {
    color: COLORS.void,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1,
  },
});

export const sharedTypography = StyleSheet.create({
  title: {
    marginBottom: 40,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.primary,
    width: "75%",
  },
  labelMd: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 2,
  },
  labelLg: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 2,
    marginBottom: 8,
  },
  labelSm: {
    color: COLORS.primary,
    fontSize: 10,
    opacity: 0.75,
    letterSpacing: 1,
  },
  displayLg: {
    color: COLORS.primary,
    fontSize: 64,
    lineHeight: 64,
    fontWeight: "900",
    letterSpacing: -2,
    marginBottom: 10,
  },
  displayMd: {
    color: COLORS.primary,
    fontSize: 38,
    lineHeight: 38,
    fontWeight: "700",
    letterSpacing: -1,
  },
  inputLabel: {
    color: COLORS.primary,
    fontSize: 14,
    letterSpacing: 1,
  },
  input: {
    color: COLORS.primary,
    fontSize: 14,
    paddingVertical: 8,
  },
  chipText: { color: COLORS.primary, fontSize: 11, letterSpacing: 1 },
  secondaryButtonText: {
    textAlign: "center",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 1,
  },
  retryButton: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  retryButtonText: {
    color: COLORS.primary,
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 1,
  },
  errorText: {
    color: COLORS.primary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 18,
  },
});
