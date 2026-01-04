using IsimSaglik.Entity.Enums;

namespace IsimSaglik.Entity.DTOs.Response
{
    public sealed record AnalysisResult
    {
        public required string Title { get; init; }
        public required string Description { get; init; }
        public required NotificationType Type { get; init; } 
    }
}