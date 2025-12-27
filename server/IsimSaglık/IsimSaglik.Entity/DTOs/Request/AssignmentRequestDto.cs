using IsimSaglik.Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace IsimSaglik.Entity.DTOs.Request
{
    public sealed record AssignmentRequestDto
    {
        [Required(ErrorMessage = "Description is required")]
        public string Description { get; init; } = string.Empty;


        [Required(ErrorMessage = "Severity is required")]
        [EnumDataType(typeof(SeverityType), ErrorMessage = "Invalid severity selected.")]
        public SeverityType Severity { get; init; }
    }
}