using IsimSaglik.Entity.Enums;

namespace IsimSaglik.Entity.Models
{
    public sealed class Notification : BaseEntity
    {
        public required string Title { get; set; }

        public required string Description { get; set; }

        public required bool IsRead { get; set; }

        public required NotificationType Type { get; set; }

        public required string UserId { get; set; }
    }
}