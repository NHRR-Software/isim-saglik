namespace IsimSaglik.Entity.Models
{
    public sealed class Token : BaseEntity
    {
        public required string RefreshToken { get; set; }

        public required Guid UserId { get; set; }

        public string? CreatedIp { get; set; }

        public string? UserAgent { get; set; }

        public required DateTime ExpiresDate { get; set; }
    }
}