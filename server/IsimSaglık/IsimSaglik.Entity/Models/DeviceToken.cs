using IsimSaglik.Entity.Enums;

namespace IsimSaglik.Entity.Models
{
    public class DeviceToken : BaseEntity
    {
        public required string Token { get; set; }
        public DeviceType DeviceType { get; set; }
        public required Guid UserId { get; set; }
    }
}