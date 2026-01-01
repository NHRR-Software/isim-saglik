using IsimSaglik.Entity.Enums;

namespace IsimSaglik.Entity.DTOs.Response
{
    public sealed record SafetyFindingResponseDto
    {
        public required Guid Id { get; init; }

        public required string Title { get; init; }

        public required FindingStatus Status { get; init; }

        public required FindingSeverity Severity { get; init; }

        public required FindingType Type { get; init; }

        public required string Description { get; init; }

        public Uri? PhotoUrl { get; init; }

        public Guid? ReportedId { get; set; }

        public DateTime? ClosedDate { get; set; }
    }
}
