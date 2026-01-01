using IsimSaglik.Entity.Enums;

namespace IsimSaglik.Entity.DTOs.Response
{
    public sealed record UserInfoResponseDto
    {
        public required Guid Id { get; init; }

        public required string FullName { get; init; }

        public required string Email { get; init; }

        public required UserRole Role { get; init; }

        public required Uri PhotoUrl { get; init; }
    }
}