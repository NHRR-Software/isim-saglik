namespace IsimSaglik.Entity.DTOs.Response
{
    public sealed record StatusSummaryResponseDto
    {
        public required int ActiveEmployeeCount { get; init; }

        public required int RiskySituationCount { get; init; }

        public required int EmergencyCount { get; init; }
    }
}