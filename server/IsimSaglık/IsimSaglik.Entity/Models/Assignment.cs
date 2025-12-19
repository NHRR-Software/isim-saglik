using IsimSaglik.Entity.Enums;

namespace IsimSaglik.Entity.Models
{
    public sealed class Assignment : BaseEntity
    {
        public required StatusType Status { get; set; }

        public required SeverityType Severity { get; set; }

        public required string Description { get; set; }

        public required string UserId { get; set; } 
    }
}