namespace IsimSaglik.Entity.Models
{
    public class SensorLog : BaseEntity
    {
        public int? HeartRate { get; set; }

        public int? SpO2 { get; set; }

        public int? StressLevel { get; set; }

        public decimal? Temperature { get; set; }

        public decimal? Humidity { get; set; }

        public int? LightLevel { get; set; }

        public decimal? NoiseLevel { get; set; }

        public required Guid UserId { get; set; }

        public required DateTime RecordedDate { get; set; }
    }
}