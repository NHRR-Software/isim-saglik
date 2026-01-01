using IsimSaglik.Entity.Enums;

namespace IsimSaglik.Entity.DTOs.Request
{
    public sealed record SafetyFindingRequestDto
    {
        public string Title { get; init; } = string.Empty;

        public FindingStatus Status { get; init; }

        public FindingSeverity Severity { get; init; }

        public FindingType Type { get; init; }

        public string Description { get; init; } = string.Empty;

        public string Base64Image { get; init; } = string.Empty;

        public Guid? ReportedId { get; init; } = Guid.Empty;
    }
}