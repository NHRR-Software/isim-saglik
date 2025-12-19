using System.ComponentModel.DataAnnotations;

namespace IsimSaglik.Entity.DTOs.Request
{
    public sealed record RegisterCompanyRequestDto
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(30, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 30 characters long.")]
        [RegularExpression(@"^[A-Za-zÇçĞğİıÖöŞşÜü]+(?: [A-Za-zÇçĞğİıÖöŞşÜü]+)*$", ErrorMessage = "Name must contain only letters and single spaces between words.")]
        public string Name { get; init; } = string.Empty;


        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [MaxLength(255, ErrorMessage = "Email address cannot exceed 255 characters.")]
        public string Email { get; init; } = string.Empty;


        [Required(ErrorMessage = "Phone Number is required")]
        public string PhoneNumber { get; init; } = string.Empty;


        [Required(ErrorMessage = "Password is required")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*\d)[A-Za-z\dÇçĞğİıÖöŞşÜü]*$", ErrorMessage = "Password must contain at least one uppercase letter and one digit.")]
        public string Password { get; init; } = string.Empty;


        [Required(ErrorMessage = "Please confirm your password again.")]
        [Compare("Password", ErrorMessage = "passwords do not match.")]
        public string PasswordAgain { get; init; } = string.Empty;

    }
}
