namespace IsimSaglik.Entity.Models
{
    public sealed class Company : BaseEntity
    {
        public required string Name { get; set; }

        public required string Email { get; set; }

        public required string Password { get; set; }

        public required string PhoneNumber { get; set; }

        public required DateTime FoundedDate { get; set; }

        public required bool IsActive { get; set; } = false;
    }
}