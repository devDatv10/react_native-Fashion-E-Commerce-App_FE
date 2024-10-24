import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import CustomTextInput from "../components/CustomTextInput";
import PasswordTextInput from "../components/PasswordTextInput";
import CustomLoginAndRegisterButton from "../components/CustomLoginAndRegisterButton";
import CustomLinkText from "../components/CustomLinkText";
import Checkbox from "expo-checkbox";
import Colors from "../themes/Color";

export default function RegisterScreen({ navigation }) {
  const [userName, setUsername] = useState("");
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [isAccept, setIsAccept] = useState(false);

  const handleRegister = () => {
    Alert.alert(
      "Register Pressed",
      `Username: ${username}, Fullname: ${fullName}, Email: ${email}, Phone: ${phoneNumber}, Address: ${address}`
    );userName
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.registerText}>Create an Account</Text>
      </View>
      <CustomTextInput
        value={userName}
        onChangeText={setUsername}
        placeholder="Enter your username"
        prefixIcon="person"
      />
      <CustomTextInput
        value={fullName}
        onChangeText={setFullname}
        placeholder="Enter your full name"
        prefixIcon="account-circle"
      />
      <CustomTextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        prefixIcon="email"
        keyboardType="email-address"
      />
      <CustomTextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter your phone number"
        prefixIcon="phone"
        keyboardType="phone-pad"
      />
      <PasswordTextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
      />
      <CustomTextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Enter your address"
        prefixIcon="location-on"
      />
      <View style={styles.acceptContainer}>
        <Checkbox
          value={isAccept}
          onValueChange={setIsAccept}
          color={isAccept ? "#0288d1" : undefined}
          style={styles.checkbox}
        />
        <Text style={styles.acceptText}>I accept the <Text style={styles.privacyText}>Privacy Policy</Text> </Text>
      </View>
      <CustomLoginAndRegisterButton
        buttonText="Register"
        buttonColor="#0288d1"
        onPress={handleRegister}
      />
      <CustomLinkText
        text="Already have an account?"
        highlightText="Login"
        onPress={() => navigation.navigate("LoginScreen")}
        highlightColor="#179e7a"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  registerText: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 15,
    // color: "#db93ff"
  },
  acceptContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 3,
  },
  acceptText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#555",
  },
  privacyText: {
    color: Colors.blackColor,
    fontSize: 18,
    fontWeight: "500"
  },
});
