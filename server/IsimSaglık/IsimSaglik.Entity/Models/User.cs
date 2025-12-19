using IsimSaglik.Entity.Enums;

namespace IsimSaglik.Entity.Models
{
    public sealed class User : BaseEntity
    {
        public required string FullName { get; set; }

        public required string Email { get; set; }

        public required string Password { get; set; }

        public required Gender Gender { get; set; }

        public required UserRole Role { get; set; }

        public required string JobTitle { get; set; }

        public required string PhoneNumber { get; set; }

        public required DateTime BirthDate { get; set; }

        public required Uri Photo { get; set; }

        public required bool IsActive { get; set; }
    }
}