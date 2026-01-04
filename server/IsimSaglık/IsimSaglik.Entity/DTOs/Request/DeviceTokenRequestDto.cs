using IsimSaglik.Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace IsimSaglik.Entity.DTOs.Request
{
    public class DeviceTokenRequestDto
    {
        [Required(ErrorMessage = "Token is required.")]
        public string Token { get; init; } = string.Empty;

        public DeviceType DeviceType { get; init; } = DeviceType.Unknown;
    }
}