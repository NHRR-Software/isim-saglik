namespace IsimSaglik.Entity.Models
{
    public sealed class HealthProfile : BaseEntity
    {
        public required Guid UserId { get; set; }

        public required string BloodGroup { get; set; }

        public string? ChronicDisease { get; set; }

        public required double Height { get; set; }

        public required double Weight { get; set; }
    }
}