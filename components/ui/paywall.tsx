"use client";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

type Theme = {
  primary: {
    main: string;
    light: string;
    dark: string;
    text: string;
    bg: string;
  };
  bg: string;
  card: string;
  text: string;
  textMuted: string;
  border: string;
  tab: string;
};

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  theme: Theme;
}

const PaywallModal = ({ visible, onClose, theme }: PaywallModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "lifetime">(
    "monthly"
  );

  const features = [
    {
      icon: "crown",
      title: "Famous Routines",
      description: "Access to exclusive Routine templates",
    },
    {
      icon: "chart-line",
      title: "Advanced Analytics",
      description: "Detailed insights and progress tracking",
    },
    {
      icon: "cloud-sync",
      title: "Data Import and Export",
      description: "Sync across all your devices",
    },
    {
      icon: "infinity",
      title: "Unlimited Routines",
      description: "Access to unlimited Routines",
    },
    {
      icon: "infinity",
      title: "Unlimited Habits",
      description: "Access to unlimited Habits",
    },
    {
      icon: "github",
      title: "Auto Check with Github",
      description: "Access to auto Check with Github",
    },
    {
      icon: "palette",
      title: "Custom Themes",
      description: "Access to custom themes",
    },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View
          style={{
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 24,
            backgroundColor: theme.card,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            maxHeight: "85%",
          }}
        >
          <View style={{ flexDirection: "row", marginBottom: 40 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                padding: 8,
                height: 44,
                width: 44,
                borderRadius: 22,
                backgroundColor: theme.border,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 12,
                marginLeft: 12,
              }}
            >
              <MaterialCommunityIcons name="close" size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: "center", marginBottom: 24 }}>
              <View
                style={{
                  backgroundColor: theme.primary.main,
                  padding: 16,
                  borderRadius: 50,
                  marginBottom: 16,
                }}
              >
                <MaterialCommunityIcons name="star" size={32} color="white" />
              </View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: theme.text,
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                Unlock Premium
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: theme.textMuted,
                  textAlign: "center",
                }}
              >
                Take your habits to the next level
              </Text>
            </View>

            {/* PRICING CARDS */}
            <View style={{ marginBottom: 24 }}>
              {/* MONTHLY PLAN */}
              <TouchableOpacity
                onPress={() => setSelectedPlan("monthly")}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor:
                    selectedPlan === "monthly"
                      ? theme.primary.main
                      : theme.border,
                  backgroundColor:
                    selectedPlan === "monthly"
                      ? theme.primary.main
                      : theme.border,
                  marginBottom: 16,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "white",
                        marginBottom: 4,
                      }}
                    >
                      Monthly Plan
                    </Text>
                    <Text style={{ fontSize: 14, color: "#94a3b8" }}>
                      Cancel anytime
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: theme.card,
                    }}
                  >
                    €3.99/mo
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelectedPlan("lifetime")}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor:
                    selectedPlan === "lifetime"
                      ? theme.primary.main
                      : theme.border,
                  backgroundColor:
                    selectedPlan === "lifetime"
                      ? theme.primary.main
                      : theme.border,
                  marginBottom: 16,
                  position: "relative",
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: -8,
                    left: 16,
                    backgroundColor: theme.bg,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    BEST VALUE
                  </Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "white",
                        marginBottom: 4,
                      }}
                    >
                      Lifetime Access
                    </Text>
                    <Text style={{ fontSize: 14, color: "#94a3b8" }}>
                      One-time payment
                    </Text>
                    <Text
                      style={{ fontSize: 12, color: "#10b981", marginTop: 2 }}
                    >
                      Save 80%
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: theme.card,
                      }}
                    >
                      €20.99
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: theme.bg,
                        textDecorationLine: "line-through",
                      }}
                    >
                      €47.88
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "white",
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                Premium Features
              </Text>

              {features.map((feature, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: theme.border,
                      padding: 8,
                      borderRadius: 20,
                      marginRight: 12,
                    }}
                  >
                    <MaterialCommunityIcons
                      name={feature.icon as any}
                      size={16}
                      color="white"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      {feature.title}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#94a3b8" }}>
                      {feature.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: theme.border,
                paddingVertical: 16,
                borderRadius: 16,
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {selectedPlan === "monthly"
                  ? "Start Monthly Plan"
                  : "Get Lifetime Access"}
              </Text>
              <Text
                style={{
                  color: theme.textMuted,
                  fontSize: 12,
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                {selectedPlan === "monthly"
                  ? "3-day free trial"
                  : "One-time payment"}
              </Text>
            </TouchableOpacity>

            {/* FOOTER */}
            <View style={{ alignItems: "center", paddingBottom: 20 }}>
              <Text style={{ color: "#6b7280", fontSize: 12, marginBottom: 8 }}>
                Secure payment • Cancel anytime
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default PaywallModal;
