namespace IsimSaglik.Entity.DTOs.Response
{
    public sealed record HealthProfileResponseDto
    {
        public required string BloodGroup { get; init; }

        public required double Weight { get; init; }

        public required double Height { get; init; }

        public string? ChronicDisease { get; init; }
    }
}