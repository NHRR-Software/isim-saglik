using IsimSaglik.Entity.Enums;

namespace IsimSaglik.Entity.Models
{
    public sealed class SafetyFinding : BaseEntity
    {
        public required string Title { get; set; }

        public required FindingStatus Status { get; set; }

        public required FindingSeverity Severity { get; set; }

        public required FindingType Type { get; set; }

        public required string Description { get; set; }

        public DateTime ClosedDate { get; set; }

        public required Uri Photo { get; set; }

        public required string CompanyId { get; set; }

        public required string ReporterId { get; set; }

        public string? ReportedId { get; set; }
    }
}
