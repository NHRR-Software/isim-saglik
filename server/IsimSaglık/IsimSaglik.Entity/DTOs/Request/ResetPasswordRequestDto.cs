using System.ComponentModel.DataAnnotations;

namespace IsimSaglik.Entity.DTOs.Request
{
    public class ResetPasswordRequestDto
    {
        [Required(ErrorMessage = "AccessToken is required")]
        public string AccessToken { get; init; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*\d)[A-Za-z\dÇçĞğİıÖöŞşÜü]*$", ErrorMessage = "Password must contain at least one uppercase letter and one digit.")]
        public string Password { get; init; } = string.Empty;


        [Required(ErrorMessage = "PasswordAgain is required.")]
        [Compare("Password", ErrorMessage = "Passwords do not match.")]
        public string PasswordAgain { get; init; } = string.Empty;
    }
}