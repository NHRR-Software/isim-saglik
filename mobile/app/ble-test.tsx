// app/ble-test.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { BleManager } from "react-native-ble-plx";
import base64 from "react-native-base64";

// ESP32'deki UUID'ler
const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
const DEVICE_NAME = "ISIM_SAGLIK_TEST";

const bleManager = new BleManager();

export default function BleTestScreen() {
  const [status, setStatus] = useState("Bağlı Değil");
  const [heartRate, setHeartRate] = useState(0);
  const [lightLevel, setLightLevel] = useState(0);
  const [rawData, setRawData] = useState("-");

  // --- 1. İZİN İSTEME (Geliştirilmiş) ---
  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      // Android 12 ve üzeri (API 31+)
      if (Platform.Version >= 31) {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return (
          result["android.permission.BLUETOOTH_CONNECT"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result["android.permission.BLUETOOTH_SCAN"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result["android.permission.ACCESS_FINE_LOCATION"] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      }
      // Android 11 ve altı
      else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Konum İzni",
            message: "Bluetooth taraması için konum izni gereklidir.",
            buttonNeutral: "Daha Sonra",
            buttonNegative: "İptal",
            buttonPositive: "Tamam",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true; // iOS için genelde info.plist yeterlidir
  };
  // --- 2. TARAMA VE BAĞLANMA ---
  const startScan = async () => {
    const permission = await requestPermissions();
    if (!permission) {
      Alert.alert("Hata", "Bluetooth izni gerekli!");
      return;
    }

    setStatus("Aranıyor...");

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        setStatus("Hata: " + error.message);
        return;
      }

      if (
        device &&
        (device.name === DEVICE_NAME || device.localName === DEVICE_NAME)
      ) {
        bleManager.stopDeviceScan();
        setStatus("Bulundu! Bağlanılıyor...");
        connectToDevice(device);
      }
    });
  };

  const connectToDevice = async (device: any) => {
    try {
      const connectedDevice = await device.connect();
      await connectedDevice.discoverAllServicesAndCharacteristics();
      setStatus("Bağlandı! Veri Bekleniyor...");

      // --- 3. VERİ OKUMA (MONITOR) ---
      connectedDevice.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        (error: any, characteristic: any) => {
          if (error) {
            console.log("Monitor Hatası:", error);
            return;
          }

          if (characteristic?.value) {
            // Base64 Decode
            const decodedData = base64.decode(characteristic.value);
            setRawData(decodedData); // Örn: "75,2048"

            // Parse Etme
            const values = decodedData.split(",");
            if (values.length >= 2) {
              setHeartRate(parseInt(values[0])); // Nabız
              setLightLevel(parseInt(values[1])); // Işık
            }
          }
        }
      );
    } catch (error) {
      setStatus("Bağlantı Hatası");
      console.log(error);
    }
  };

  useEffect(() => {
    // Sayfa açılınca otomatik tara (İstersen butona bağla)
    startScan();

    // Temizlik
    return () => {
      bleManager.stopDeviceScan();
      bleManager.destroy();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ESP32 Sensör Testi</Text>

      <View style={styles.statusBox}>
        <Text style={styles.statusText}>Durum: {status}</Text>
      </View>

      <View style={styles.dataContainer}>
        <View style={[styles.card, { backgroundColor: "#FFEBEE" }]}>
          <Text style={styles.label}>❤️ Nabız</Text>
          <Text style={[styles.value, { color: "#D32F2F" }]}>
            {heartRate} bpm
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#FFF3E0" }]}>
          <Text style={styles.label}>💡 Işık</Text>
          <Text style={[styles.value, { color: "#F57C00" }]}>{lightLevel}</Text>
        </View>
      </View>

      <Text style={styles.rawText}>Ham Veri: {rawData}</Text>

      <TouchableOpacity style={styles.button} onPress={startScan}>
        <Text style={styles.buttonText}>Yeniden Tara</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  statusBox: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
  },
  dataContainer: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 30,
  },
  card: {
    width: 140,
    height: 120,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  value: {
    fontSize: 32,
    fontWeight: "bold",
  },
  rawText: {
    color: "#888",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
