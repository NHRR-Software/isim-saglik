using System.ComponentModel.DataAnnotations;

namespace IsimSaglik.Entity.DTOs.Request
{
    public class SensorLogRequestDto
    {
        [Required(ErrorMessage = "At least one reading is required.")]
        [MinLength(1, ErrorMessage = "Readings list cannot be empty.")]
        public IEnumerable<SensorLogDto> SensorLogs { get; init; } = [];
    }
}