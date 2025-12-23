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

        public  Uri? PhotoUrl { get; set; } 

        public required Guid CompanyId { get; set; }

        public required Guid ReporterId { get; set; }

        public Guid? ReportedId { get; set; }
    }
}
