namespace IsimSaglik.Entity.DTOs.Response
{
    public sealed record TokenResponseDto
    {
        public required string AccessToken { get; init; }

        public required string RefreshToken { get; init; }
    }
}