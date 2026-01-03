namespace IsimSaglik.Entity.DTOs.Response
{
    public sealed record SensorDataDto
    {
        public required int? HeartRate { get; init; }
        public required int? SpO2 { get; init; }
        public required int? StressLevel { get; init; }
        public required decimal? Temperature { get; init; }
        public required decimal? Humidity { get; init; }
        public required int? LightLevel { get; init; }
        public required decimal? NoiseLevel { get; init; }
        public required DateTime RecordedDate { get; init; }
    }
}