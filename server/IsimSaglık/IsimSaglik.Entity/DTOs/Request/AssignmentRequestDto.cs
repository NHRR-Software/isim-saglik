using IsimSaglik.Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace IsimSaglik.Entity.DTOs.Request
{
    public sealed record AssignmentRequestDto
    {
        [Required(ErrorMessage = "Assignment description is required")]
        public string Description { get; init; } = string.Empty;


        [Required(ErrorMessage = "Assignment severity is required")]
        public SeverityType Severity { get; init; }
    }
}