// hooks/useBLE.ts

import { useState, useRef } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { decode } from 'base-64'; 
// Arduino Kodundaki UUID'ler ile AYNI
const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
const DEVICE_NAME = "ISIM_SAGLIK_TEST";

const bleManager = new BleManager();

export interface SensorData {
  heartRate: number;
  light: number;
  temp: number;
  humidity: number;
  noise: number;
  spo2: number;
  stress: number;
}

export default function useBLE() {
  const [deviceID, setDeviceID] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  
  // Başlangıç Değerleri
  const [sensorData, setSensorData] = useState<SensorData>({
    heartRate: 0,
    light: 0,
    temp: 0,
    humidity: 0,
    noise: 0,
    spo2: 0, 
    stress: 0
  });

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return (
          result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true;
  };

  const scanAndConnect = async () => {
    const permission = await requestPermissions();
    if (!permission) {
        console.log("İzin verilmedi.");
        return;
    }

    if (connectionStatus === 'Connected' || connectionStatus === 'Connecting...') return;

    setConnectionStatus("Scanning...");
    console.log("Cihaz aranıyor...");

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("Scan Error:", error);
        setConnectionStatus("Error");
        return;
      }

      // İsim Eşleşmesi Kontrolü
      if (device && (device.name === DEVICE_NAME || device.localName === DEVICE_NAME)) {
        console.log("Cihaz Bulundu:", device.name);
        bleManager.stopDeviceScan();
        setConnectionStatus("Connecting...");
        connectToDevice(device);
      }
    });
  };

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await device.connect();
      setDeviceID(deviceConnection.id);
      setConnectionStatus("Connected");
      console.log("Bağlantı Başarılı!");

      await deviceConnection.discoverAllServicesAndCharacteristics();
      startStreamingData(deviceConnection);
      
      deviceConnection.onDisconnected(() => {
         console.log("Bağlantı Koptu!");
         setConnectionStatus("Disconnected");
         scanAndConnect(); // Otomatik tekrar dene
      });

    } catch (e) {
      console.log("Bağlantı Hatası:", e);
      setConnectionStatus("Failed");
    }
  };

  const startStreamingData = async (device: Device) => {
    device.monitorCharacteristicForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      (error, characteristic) => {
        if (error) {
            console.log("Veri Okuma Hatası:", error);
            return;
        }
        
        if (characteristic?.value) {
            const rawData = decode(characteristic.value);
            // --- LOGLAMA BURADA ---
            // Terminalde bu çıktıyı görüyorsan her şey çalışıyor demektir.
            // Örnek Çıktı: "72,2048,24.5,50.0,45,98,20"
            console.log("🔥 GELEN VERİ:", rawData); 
            
            parseSensorData(rawData);
        }
      }
    );
  };

 const parseSensorData = (dataString: string) => {
      // Gelen Veri: "76,81,28.1,38.0,80,9,25" 
      // Sıralama: Nabız, Işık, Sıcaklık, Nem, Gürültü, SpO2, Stres
      const values = dataString.split(',');

      if (values.length > 0) {
          setSensorData(prev => ({
              ...prev,
              heartRate: parseInt(values[0]) || prev.heartRate,
              light: parseInt(values[1]) || prev.light,
              temp: parseFloat(values[2]) || prev.temp,
              humidity: parseFloat(values[3]) || prev.humidity,
              noise: parseInt(values[4]) || prev.noise,
              spo2: parseInt(values[5]) || prev.spo2,
              stress: values[6] && !isNaN(parseInt(values[6])) ? parseInt(values[6]) : prev.stress 
          }));
      }
  };
  return { scanAndConnect, connectionStatus, sensorData };
}