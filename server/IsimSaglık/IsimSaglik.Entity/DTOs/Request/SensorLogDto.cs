using System.ComponentModel.DataAnnotations;

namespace IsimSaglik.Entity.DTOs.Request
{
    public sealed record SensorLogDto
    {
        [Range(30, 250, ErrorMessage = "Heart rate must be between 30 and 250.")]
        public int? HeartRate { get; init; }



        [Range(0, 100, ErrorMessage = "SpO2 must be between 0 and 100.")]
        public int? SpO2 { get; init; }



        [Range(0, 100, ErrorMessage = "Stress level must be between 0 and 100.")]
        public int? StressLevel { get; init; }



        [Range(-50, 100, ErrorMessage = "Temperature is out of valid range.")]
        public decimal? Temperature { get; init; }



        [Range(0, 100, ErrorMessage = "Humidity must be between 0 and 100.")]
        public decimal? Humidity { get; init; }



        [Range(0, 100000, ErrorMessage = "Light level is out of valid range.")]
        public int? LightLevel { get; init; }



        [Range(0, 200, ErrorMessage = "Noise level is out of valid range.")]
        public decimal? NoiseLevel { get; init; }



        [Required(ErrorMessage = "RecordedDate  is required.")]
        public DateTime RecordedDate { get; init; }
    }
}
