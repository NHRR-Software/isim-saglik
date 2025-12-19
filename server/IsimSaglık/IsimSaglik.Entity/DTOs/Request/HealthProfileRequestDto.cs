using System.ComponentModel.DataAnnotations;

namespace IsimSaglik.Entity.DTOs.Request
{
    public sealed record HealthProfileRequestDto
    {
        [Required(ErrorMessage = "Blood Group is required")]
        public string BloodGroup { get; init; } = string.Empty;


        [Required(ErrorMessage = "Weight is required")]
        public double Weight { get; init; }


        [Required(ErrorMessage = "Height is required")]
        public double Height { get; init; }

        public string ChronicDisease { get; init; } = string.Empty;
    }
}