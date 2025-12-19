namespace IsimSaglik.Entity.Models
{
    public sealed class HealthProfile : BaseEntity
    {
        public required string UserId { get; set; }

        public required string BloodGroup { get; set; }

        public string ChronicDisease { get; set; } = string.Empty;

        public required double Height { get; set; }

        public required double Weight { get; set; }
    }
}