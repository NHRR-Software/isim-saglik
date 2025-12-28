using System.ComponentModel.DataAnnotations;

namespace IsimSaglik.Entity.DTOs.Request
{
    public sealed record RefreshTokenRequestDto
    {
        [Required(ErrorMessage = "Please enter the refresh token.")]
        [StringLength(44, MinimumLength = 44, ErrorMessage = "Refresh token is not in a valid format or has an incorrect length.")]
        public string Token { get; init; } = string.Empty;
    }
}