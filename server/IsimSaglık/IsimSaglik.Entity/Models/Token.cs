namespace IsimSaglik.Entity.Models
{
    public sealed class Token : BaseEntity
    {
        public required string RefreshToken { get; set; }

        public required string UserId { get; set; }

        public string CreatedIp { get; set; } = string.Empty;

        public string UserAgent { get; set; } = string.Empty;

        public required DateTime ExpiresDate { get; set; }

    }
}