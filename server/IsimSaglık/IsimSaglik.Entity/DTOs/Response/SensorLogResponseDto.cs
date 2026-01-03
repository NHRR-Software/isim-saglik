namespace IsimSaglik.Entity.DTOs.Response
{
    public sealed record SensorLogResponseDto
    {
        public required SensorDataDto CurrentData { get; init; }

        public required IEnumerable<SensorDataDto> HistoryData { get; init; }

        public required DateTime LastUpdateDate { get; init; }
    }
}