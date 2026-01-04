using IsimSaglik.Entity.DTOs.Response;
using IsimSaglik.Entity.Enums;
using IsimSaglik.Entity.Models;

namespace IsimSaglik.Service.Utilities
{
    internal static class HealthAnalyzer
    {
        private const int MinDataPointsForStats = 20;
        private const double ZScoreThreshold = 3.0;

        private const int MaxHeartRate = 120;
        private const int MinHeartRate = 45;
        private const int MinSpO2 = 90;
        private const int MaxStress = 80;
        private const decimal MinHumidity = 30;
        private const decimal MaxHumidity = 70;

        public static IEnumerable<AnalysisResult> Analyze(IEnumerable<SensorLog> historyLogs, SensorLog currentLog)
        {
            var results = new List<AnalysisResult>();

            var healthAnomalies = DetectHealthAnomalies(historyLogs, currentLog);
            results.AddRange(healthAnomalies);

            var environmentAnomalies = DetectEnvironmentAnomalies(historyLogs, currentLog);
            results.AddRange(environmentAnomalies);

            var ppeSuggestions = SuggestPPE(currentLog);
            results.AddRange(ppeSuggestions);

            return results;
        }

        private static IEnumerable<AnalysisResult> DetectHealthAnomalies(IEnumerable<SensorLog> history, SensorLog current)
        {
            var anomalies = new List<AnalysisResult>();
            var dataCount = history.Count();

            if (current.HeartRate.HasValue)
            {
                bool isAnomaly = false;
                if (dataCount >= MinDataPointsForStats)
                {
                    var values = history.Where(x => x.HeartRate.HasValue).Select(x => (double)x.HeartRate!.Value).ToList();
                    isAnomaly = IsStatisticalAnomaly(values, current.HeartRate.Value);
                }
                else
                {
                    isAnomaly = current.HeartRate.Value > MaxHeartRate || current.HeartRate.Value < MinHeartRate;
                }

                if (isAnomaly)
                {
                    anomalies.Add(new AnalysisResult
                    {
                        Title = "Anormal Kalp Atışı",
                        Description = $"Kalp atış hızınız ({current.HeartRate} bpm) normal seyir aralığınızın dışında.",
                        Type = NotificationType.Alert
                    });
                }
            }

            if (current.SpO2.HasValue)
            {
                if (current.SpO2.Value < MinSpO2)
                {
                    anomalies.Add(new AnalysisResult
                    {
                        Title = "Düşük Oksijen Seviyesi",
                        Description = $"Kandaki oksijen oranınız (%{current.SpO2}) kritik seviyenin altında.",
                        Type = NotificationType.Alert
                    });
                }
            }

            if (current.StressLevel.HasValue)
            {
                bool isStressHigh = false;
                if (dataCount >= MinDataPointsForStats)
                {
                    var values = history.Where(x => x.StressLevel.HasValue).Select(x => (double)x.StressLevel!.Value).ToList();
                    isStressHigh = IsStatisticalAnomaly(values, current.StressLevel.Value) && current.StressLevel.Value > 50;
                }
                else
                {
                    isStressHigh = current.StressLevel.Value > MaxStress;
                }

                if (isStressHigh)
                {
                    anomalies.Add(new AnalysisResult
                    {
                        Title = "Yüksek Stres Algılandı",
                        Description = "Stres seviyenizde ani bir yükseliş tespit edildi. Kısa bir mola vermeniz önerilir.",
                        Type = NotificationType.Alert
                    });
                }
            }

            return anomalies;
        }

        private static IEnumerable<AnalysisResult> DetectEnvironmentAnomalies(IEnumerable<SensorLog> history, SensorLog current)
        {
            var anomalies = new List<AnalysisResult>();
            var dataCount = history.Count();

            if (current.Humidity.HasValue)
            {
                bool isAnomaly = false;
                if (dataCount >= MinDataPointsForStats)
                {
                    var values = history.Where(x => x.Humidity.HasValue).Select(x => (double)x.Humidity!.Value).ToList();
                    isAnomaly = IsStatisticalAnomaly(values, (double)current.Humidity.Value);
                }
                else
                {
                    isAnomaly = current.Humidity.Value > MaxHumidity || current.Humidity.Value < MinHumidity;
                }

                if (isAnomaly)
                {
                    anomalies.Add(new AnalysisResult
                    {
                        Title = "Nem Seviyesi Uyarısı",
                        Description = $"Ortam nem seviyesi (%{current.Humidity}) ideal çalışma koşullarının dışında.",
                        Type = NotificationType.Information
                    });
                }
            }

            return anomalies;
        }

        private static IEnumerable<AnalysisResult> SuggestPPE(SensorLog current)
        {
            var suggestions = new List<AnalysisResult>();

            if (current.NoiseLevel.HasValue && current.NoiseLevel.Value > 85)
            {
                suggestions.Add(new AnalysisResult
                {
                    Title = "KKD Önerisi: Kulaklık",
                    Description = $"Ortam gürültüsü yüksek ({current.NoiseLevel:F1} dB). Lütfen kulak koruyucu donanımınızı takınız.",
                    Type = NotificationType.Reminder
                });
            }

            if (current.LightLevel.HasValue)
            {
                if (current.LightLevel.Value < 50)
                {
                    suggestions.Add(new AnalysisResult
                    {
                        Title = "KKD Önerisi: Aydınlatma",
                        Description = "Ortam ışığı çalışma için yetersiz. Lütfen kafa lambası veya el feneri kullanınız.",
                        Type = NotificationType.Reminder
                    });
                }
            }

            if (current.Temperature.HasValue && current.Temperature.Value > 35)
            {
                suggestions.Add(new AnalysisResult
                {
                    Title = "Yüksek Sıcaklık Uyarısı",
                    Description = "Ortam sıcaklığı çok yüksek. Lütfen sık sık su içiniz ve serinleme molaları veriniz.",
                    Type = NotificationType.Alert
                });
            }

            return suggestions;
        }

        private static bool IsStatisticalAnomaly(List<double> historyValues, double currentValue)
        {
            if (historyValues.Count < 2) return false;

            double mean = historyValues.Average();
            double sumOfSquares = historyValues.Sum(val => Math.Pow(val - mean, 2));
            double stdDev = Math.Sqrt(sumOfSquares / (historyValues.Count - 1));

            if (stdDev == 0) return Math.Abs(currentValue - mean) > 0;

            double zScore = (currentValue - mean) / stdDev;

            return Math.Abs(zScore) > ZScoreThreshold;
        }
    }
}