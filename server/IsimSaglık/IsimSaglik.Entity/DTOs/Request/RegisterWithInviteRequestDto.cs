using IsimSaglik.Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace IsimSaglik.Entity.DTOs.Request
{
    public sealed record RegisterWithInviteRequestDto
    {
        [Required(ErrorMessage = "AccessToken is required")]
        public string AccessToken { get; init; } = string.Empty;


        [Required(ErrorMessage = "FullName is required")]
        public string FullName { get; init; } = string.Empty;


        [Required(ErrorMessage = "Password is required")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*\d)[A-Za-z\dÇçĞğİıÖöŞşÜü]*$", ErrorMessage = "Password must contain at least one uppercase letter and one digit.")]
        public string Password { get; init; } = string.Empty;


        [Required(ErrorMessage = "PasswordAgain is required.")]
        [Compare("Password", ErrorMessage = "Passwords do not match.")]
        public string PasswordAgain { get; init; } = string.Empty;


        [Required(ErrorMessage = "Gender is required")]
        [EnumDataType(typeof(Gender), ErrorMessage = "Invalid gender selected.")]
        public Gender Gender { get; init; }


        [Required(ErrorMessage = "PhoneNumber is required")]
        public string PhoneNumber { get; init; } = string.Empty;


        [Required(ErrorMessage = "BirthDate is required")]
        public DateTime BirthDate { get; init; }
    }
}