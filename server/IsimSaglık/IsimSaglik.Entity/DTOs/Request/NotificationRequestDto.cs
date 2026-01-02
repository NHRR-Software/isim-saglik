using IsimSaglik.Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace IsimSaglik.Entity.DTOs.Request
{
    public sealed record NotificationRequestDto
    {

        [Required(ErrorMessage = "Title is required")]
        public string Title { get; init; } = string.Empty;


        [Required(ErrorMessage = "Description is required")]
        public string Description { get; init; } = string.Empty;


        [Required(ErrorMessage = "Type is required")]
        [EnumDataType(typeof(NotificationType), ErrorMessage = "Invalid Type selected.")]
        public NotificationType Type { get; init; }
    }
}