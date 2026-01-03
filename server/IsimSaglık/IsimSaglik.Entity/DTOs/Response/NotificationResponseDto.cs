using IsimSaglik.Entity.Enums;

namespace IsimSaglik.Entity.DTOs.Response
{
    public sealed record NotificationResponseDto
    {
        public required Guid Id { get; init; }
        public required string Title { get; init; }
        public required string Description { get; init; }
        public required bool IsRead { get; init; }
        public required NotificationType Type { get; init; }
        public required DateTime CreatedDate { get; init; }
    }
}
