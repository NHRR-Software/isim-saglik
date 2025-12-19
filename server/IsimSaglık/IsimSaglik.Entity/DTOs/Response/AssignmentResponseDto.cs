using IsimSaglik.Entity.Enums;

namespace IsimSaglik.Entity.DTOs.Response
{
    public sealed record AssignmentResponseDto
    {
        public required string Id { get; init; }

        public required StatusType Status { get; set; }

        public required string Description { get; init; }

        public required SeverityType Severity { get; init; }

        public required DateTime CreatedDate { get; init; }

    }
}