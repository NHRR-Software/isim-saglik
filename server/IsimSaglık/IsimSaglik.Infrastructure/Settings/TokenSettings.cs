namespace IsimSaglik.Infrastructure.Settings
{
    public class TokenSettings
    {
        public string Issuer { get; init; } = null!;
        public string Audience { get; init; } = null!;
        public string Secret { get; init; } = null!;
        public int AccessTokenExpirationMinutes { get; init; }
        public int RefreshTokenExpirationDays { get; init; }
    }
}