// hooks/useSensorLogger.ts

import { useState, useEffect, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = "http://isim-saglik-server-env.eba-dyawubcm.us-west-2.elasticbeanstalk.com";

export default function useSensorLogger(sensorData: any) {
  const [buffer, setBuffer] = useState<any[]>([]); // 1 dakikalık veri havuzu
  const [logsQueue, setLogsQueue] = useState<any[]>([]); // 5 dakikalık gönderilecek paket

  // 1. Saniyelik Veri Toplama
  useEffect(() => {
    // Sadece geçerli veri varsa ekle
    if (sensorData.heartRate > 0 || sensorData.temp > 0) {
        const interval = setInterval(() => {
            setBuffer(prev => [...prev, { ...sensorData, timestamp: new Date() }]);
        }, 1000); // Her saniye mevcut veriyi kaydet
        return () => clearInterval(interval);
    }
  }, [sensorData]);

  // 2. Dakikalık Ortalama Alma (Aggregation)
  useEffect(() => {
    const minuteInterval = setInterval(() => {
      if (buffer.length > 0) {
        const avgLog = calculateAverage(buffer);
        setLogsQueue(prev => [...prev, avgLog]);
        setBuffer([]); // Buffer'ı temizle
        console.log("📊 1 Dakikalık Ortalama Alındı:", avgLog);
      }
    }, 60 * 1000); // 1 Dakika

    return () => clearInterval(minuteInterval);
  }, [buffer]);

  // 3. 5 Dakikada Bir Gönderim
  useEffect(() => {
    if (logsQueue.length >= 5) {
      sendLogsToApi(logsQueue);
      setLogsQueue([]); // Kuyruğu sıfırla
    }
  }, [logsQueue]);

  const calculateAverage = (dataList: any[]) => {
    const count = dataList.length;
    if (count === 0) return null;

    const sum = dataList.reduce((acc, curr) => ({
      heartRate: acc.heartRate + (curr.heartRate || 0),
      spO2: acc.spO2 + (curr.spo2 || 0), // Backend spO2 (küçük o) istiyor olabilir, kontrol et
      stressLevel: acc.stressLevel + (curr.stress || 0),
      temperature: acc.temperature + (curr.temp || 0),
      humidity: acc.humidity + (curr.humidity || 0),
      lightLevel: acc.lightLevel + (curr.light || 0),
      noiseLevel: acc.noiseLevel + (curr.noise || 0),
    }), { heartRate: 0, spO2: 0, stressLevel: 0, temperature: 0, humidity: 0, lightLevel: 0, noiseLevel: 0 });

    return {
      heartRate: Math.round(sum.heartRate / count),
      spO2: Math.round(sum.spO2 / count),
      stressLevel: Math.round(sum.stressLevel / count),
      temperature: parseFloat((sum.temperature / count).toFixed(1)),
      humidity: parseFloat((sum.humidity / count).toFixed(1)),
      lightLevel: Math.round(sum.lightLevel / count),
      noiseLevel: Math.round(sum.noiseLevel / count),
      recordedDate: new Date().toISOString()
    };
  };

  const sendLogsToApi = async (logs: any[]) => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) return;

      console.log("🚀 5 Dakikalık Veri Gönderiliyor...", logs.length);
      
      const response = await fetch(`${API_BASE_URL}/api/sensor-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ sensorLogs: logs })
      });

      if (!response.ok) {
         console.error("Sensor Log Upload Failed:", response.status);
      } else {
         console.log("✅ Sensör verileri başarıyla kaydedildi.");
      }
    } catch (error) {
      console.error("Log Send Error:", error);
    }
  };
}