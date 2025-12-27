using IsimSaglik.Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace IsimSaglik.Entity.DTOs.Request
{
    public sealed record InviteUserRequestDto
    {

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [MaxLength(255, ErrorMessage = "Email address cannot exceed 255 characters.")]
        public required string Email { get; init; }


        [Required(ErrorMessage = "Role is required")]
        [EnumDataType(typeof(UserRole), ErrorMessage = "Invalid role selected.")]
        public required UserRole Role { get; init; }
    }
}
