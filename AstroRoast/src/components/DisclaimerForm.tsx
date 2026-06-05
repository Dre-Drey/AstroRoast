import { useState } from "react";
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { COLORS } from "../constants/theme";
import { submitRoastReport } from "../actions";
import type { DailyRoast } from "../types/database";

export default function DisclaimerForm({
  data,
}: {
  data: DailyRoast | undefined;
}) {
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportMessage, setReportMessage] = useState("");

  const handleSubmitReport = async (data: DailyRoast | undefined) => {
    if (!data) {
      return;
    }

    const trimmedMessage = reportMessage.trim();
    if (!trimmedMessage) {
      Alert.alert(
        "Missing message",
        "Please tell us what felt off so we can review this roast.",
      );
      return;
    }

    setReportSubmitting(true);
    try {
      await submitRoastReport({ roast: data, message: trimmedMessage });
      setReportMessage("");
      setReportOpen(false);
      Alert.alert(
        "Report received",
        "Thanks. We linked your message to this roast and saved it for review.",
      );
    } catch (reportError) {
      console.error("Error submitting roast report:", reportError);
      Alert.alert("Could not send report", "Please try again in a moment.");
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <View style={styles.disclaimerContainer}>
      <Text style={styles.disclaimerTitle}>FOR ENTERTAINMENT ONLY</Text>
      <Text style={styles.disclaimerText}>
        This roast is intentionally biting and meant purely for fun. If it feels
        offensive or inappropriate, send us a quick note below so we can review
        this specific roast.
      </Text>

      <TouchableOpacity
        style={styles.reportToggle}
        onPress={() => setReportOpen((current) => !current)}
      >
        <Text style={styles.reportToggleText}>
          {reportOpen ? "HIDE REPORT FORM" : "FLAG THIS ROAST"}
        </Text>
      </TouchableOpacity>

      {reportOpen && (
        <View style={styles.reportForm}>
          <Text style={styles.reportLabel}>
            WHAT FELT OFF ABOUT THIS ROAST?
          </Text>
          <TextInput
            value={reportMessage}
            onChangeText={setReportMessage}
            placeholder="Tell us what happened..."
            placeholderTextColor="#666"
            multiline
            textAlignVertical="top"
            style={styles.reportInput}
            maxLength={500}
          />
          <Text style={styles.reportHint}>
            We store this with the roast date, sign, and content so we can
            review the exact version you saw.
          </Text>
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => handleSubmitReport(data)}
            disabled={reportSubmitting}
          >
            <Text style={styles.reportButtonText}>
              {reportSubmitting ? "SENDING..." : "SEND REPORT"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  disclaimerContainer: {
    backgroundColor: COLORS.surfaceHigh,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    padding: 15,
    marginBottom: 28,
  },
  disclaimerTitle: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  disclaimerText: {
    color: COLORS.primary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },
  reportToggle: {
    borderWidth: 1,
    borderColor: COLORS.outline,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  reportToggleText: {
    color: COLORS.primary,
    textAlign: "center",
    fontWeight: "800",
    letterSpacing: 1,
    fontSize: 12,
  },
  reportForm: {
    marginTop: 6,
  },
  reportLabel: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
  },
  reportInput: {
    minHeight: 110,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.outline,
    color: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  reportHint: {
    color: "#b7b7b7",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  reportButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  reportButtonText: {
    color: COLORS.void,
    textAlign: "center",
    fontWeight: "900",
    letterSpacing: 1,
    fontSize: 12,
  },
});
