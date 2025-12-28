using IsimSaglik.Entity.Enums;

namespace IsimSaglik.Entity.DTOs.Response
{
    public sealed record EmployeeListResponseDto
    {
        public required string Id { get; init; }

        public required Uri Photo { get; init; }

        public required string Name { get; init; }

        public required UserRole Role { get; init; }

        public required string JobTitle { get; init; }
    }
}