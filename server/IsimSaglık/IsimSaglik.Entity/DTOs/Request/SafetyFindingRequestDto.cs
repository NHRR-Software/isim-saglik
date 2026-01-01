using IsimSaglik.Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace IsimSaglik.Entity.DTOs.Request
{
    public sealed record SafetyFindingRequestDto
    {

        public string Title { get; init; } = string.Empty;

        [Required(ErrorMessage = "Status is required")]
        [EnumDataType(typeof(FindingStatus), ErrorMessage = "Invalid Status selected.")]
        public FindingStatus Status { get; init; }


        [Required(ErrorMessage = "Severity is required")]
        [EnumDataType(typeof(FindingSeverity), ErrorMessage = "Invalid Severity selected.")]
        public FindingSeverity Severity { get; init; }


        [Required(ErrorMessage = "Type is required")]
        [EnumDataType(typeof(FindingType), ErrorMessage = "Invalid Type selected.")]
        public FindingType Type { get; init; }


        [Required(ErrorMessage = "Description is required")]
        public string Description { get; init; } = string.Empty;


        [Required(ErrorMessage = "Base64Image is required")]
        public string Base64Image { get; init; } = string.Empty;


        [Required(ErrorMessage = "ReportedId is required")]
        public Guid? ReportedId { get; init; } = Guid.Empty;
    }
}