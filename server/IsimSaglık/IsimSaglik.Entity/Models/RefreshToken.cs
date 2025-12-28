namespace IsimSaglik.Entity.Models
{
    public sealed class RefreshToken : BaseEntity
    {
        public required string Token { get; set; }

        public required Guid UserId { get; set; }

        public string? CreatedIp { get; set; }

        public string? UserAgent { get; set; }

        public required DateTime ExpiresDate { get; set; }
    }
}