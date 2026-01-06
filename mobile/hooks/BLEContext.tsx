// app/context/BLEContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import useBLE, { SensorData } from "../hooks/useBLE"; // Mevcut hook'umuzu kullanıyoruz
import * as SecureStore from "expo-secure-store";

const API_BASE_URL =
  "http://isim-saglik-server-env.eba-dyawubcm.us-west-2.elasticbeanstalk.com";

interface BLEContextType {
  connectionStatus: string;
  sensorData: SensorData;
  scanAndConnect: () => void;
}

const BLEContext = createContext<BLEContextType | undefined>(undefined);

export const BLEProvider = ({ children }: { children: React.ReactNode }) => {
  const { scanAndConnect, connectionStatus, sensorData } = useBLE();

  // --- LOGLAMA MANTIĞI (Buraya Taşındı) ---
  const [buffer, setBuffer] = useState<any[]>([]);
  const [logsQueue, setLogsQueue] = useState<any[]>([]);

  // 1. Saniyelik Veri Toplama
  useEffect(() => {
    if (connectionStatus === "Connected") {
      const interval = setInterval(() => {
        // Sadece anlamlı veri varsa ekle (hepsi 0 değilse)
        if (sensorData.heartRate > 0 || sensorData.temp > 0) {
          setBuffer((prev) => [...prev, sensorData]);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sensorData, connectionStatus]);

  // 2. Dakikalık Ortalama Alma
  useEffect(() => {
    const minuteInterval = setInterval(() => {
      if (buffer.length > 0) {
        const avgLog = calculateAverage(buffer);
        if (avgLog) {
          setLogsQueue((prev) => [...prev, avgLog]);
          console.log(
            "📊 [BG Service] 1 Dakikalık Ortalama Alındı:",
            avgLog.heartRate,
            "BPM"
          );
        }
        setBuffer([]);
      }
    }, 60 * 1000);

    return () => clearInterval(minuteInterval);
  }, [buffer]);

  // 3. 5 Dakikada Bir Gönderim
  useEffect(() => {
    if (logsQueue.length >= 5) {
      sendLogsToApi(logsQueue);
      setLogsQueue([]);
    }
  }, [logsQueue]);

  const calculateAverage = (dataList: any[]) => {
    const count = dataList.length;
    if (count === 0) return null;

    const sum = dataList.reduce(
      (acc, curr) => ({
        heartRate: acc.heartRate + (curr.heartRate || 0),
        spO2: acc.spO2 + (curr.spo2 || 0),
        stressLevel: acc.stressLevel + (curr.stress || 0),
        temperature: acc.temperature + (curr.temp || 0),
        humidity: acc.humidity + (curr.humidity || 0),
        lightLevel: acc.lightLevel + (curr.light || 0),
        noiseLevel: acc.noiseLevel + (curr.noise || 0),
      }),
      {
        heartRate: 0,
        spO2: 0,
        stressLevel: 0,
        temperature: 0,
        humidity: 0,
        lightLevel: 0,
        noiseLevel: 0,
      }
    );

    return {
      heartRate: Math.round(sum.heartRate / count),
      spO2: Math.round(sum.spO2 / count),
      stressLevel: Math.round(sum.stressLevel / count),
      temperature: parseFloat((sum.temperature / count).toFixed(1)),
      humidity: parseFloat((sum.humidity / count).toFixed(1)),
      lightLevel: Math.round(sum.lightLevel / count),
      noiseLevel: Math.round(sum.noiseLevel / count),
      recordedDate: new Date().toISOString(),
    };
  };

  const sendLogsToApi = async (logs: any[]) => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) return;

      console.log("🚀 [BG Service] Veri Gönderiliyor...", logs.length);
      const response = await fetch(`${API_BASE_URL}/api/sensor-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sensorLogs: logs }),
      });

      if (!response.ok) {
        console.error("Log Upload Failed:", response.status);
      } else {
        console.log("✅ [BG Service] Veriler Kaydedildi.");
      }
    } catch (error) {
      console.error("Log Send Error:", error);
    }
  };

  return (
    <BLEContext.Provider
      value={{ connectionStatus, sensorData, scanAndConnect }}
    >
      {children}
    </BLEContext.Provider>
  );
};

export const useBLEContext = () => {
  const context = useContext(BLEContext);
  if (!context) {
    throw new Error("useBLEContext must be used within a BLEProvider");
  }
  return context;
};
