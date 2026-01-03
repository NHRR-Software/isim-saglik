namespace IsimSaglik.Entity.DTOs.Request
{
    public class LiveSensorLogDto
    {
        public required Guid UserId { get; init; }
        public int? HeartRate { get; init; }
        public int? SpO2 { get; init; }
        public int? StressLevel { get; init; }
        public decimal? Temperature { get; init; }
        public decimal? Humidity { get; init; }
        public int? LightLevel { get; init; }
        public decimal? NoiseLevel { get; init; }
    }
}