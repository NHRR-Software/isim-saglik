using IsimSaglik.Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace IsimSaglik.Entity.DTOs.Request
{
    public sealed record UserRequestDto
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(30, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 30 characters long.")]
        [RegularExpression(@"^[A-Za-zÇçĞğİıÖöŞşÜü]+(?: [A-Za-zÇçĞğİıÖöŞşÜü]+)*$", ErrorMessage = "Name must contain only letters and single spaces between words.")]
        public string Name { get; init; } = string.Empty;


        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [MaxLength(255, ErrorMessage = "Email address cannot exceed 255 characters.")]
        public string Email { get; init; } = string.Empty;


        [Required(ErrorMessage = "PhoneNumber is required")]
        public string PhoneNumber { get; init; } = string.Empty;


        [Required(ErrorMessage = "JobTitle is required")]
        public string? JobTitle { get; init; } = string.Empty;


        [Required(ErrorMessage = "Gender is required")]
        [EnumDataType(typeof(Gender), ErrorMessage = "Invalid gender selected.")]
        public required Gender Gender { get; init; }


        [Required(ErrorMessage = "Role is required")]
        [EnumDataType(typeof(UserRole), ErrorMessage = "Invalid role selected.")]
        public required UserRole Role { get; init; }


        [Required(ErrorMessage = "BirthDate is required")]
        [DataType(DataType.Date)]
        public required DateTime BirthDate { get; set; }

    }
}