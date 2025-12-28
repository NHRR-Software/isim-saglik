using IsimSaglik.Entity.Enums;

namespace IsimSaglik.Entity.Models
{
    public sealed class UserInvitation : BaseEntity
    {
        public required string Email { get; set; }

        public required UserRole Role { get; set; } 

        public required Guid CompanyId { get; set; } 

        public required DateTime ExpiresDate { get; set; }

        public required bool IsUsed { get; set; } = false;
    }
}