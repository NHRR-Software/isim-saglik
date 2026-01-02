using IsimSaglik.Entity.Enums;

namespace IsimSaglik.Entity.DTOs.Response
{
    public sealed record UserResponseDto
    {
        public required Guid Id { get; init; }

        public required string Email { get; init; }

        public required string FullName { get; init; }

        public required string PhoneNumber { get; init; }

        public string? JobTitle { get; init; }

        public required Gender Gender { get; init; }

        public required UserRole Role { get; init; }

        public required DateTime BirthDate { get; init; }

        public required Uri PhotoUrl { get; init; }

        public bool IsSetupCompleted { get; set; } = true;
    }
}