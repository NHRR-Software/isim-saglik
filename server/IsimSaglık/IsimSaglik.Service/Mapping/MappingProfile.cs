using AutoMapper;
using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;
using IsimSaglik.Entity.Enums;
using IsimSaglik.Entity.Models;

namespace IsimSaglik.Service.Mapping
{
    public sealed class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // RegisterCompanyRequestDto -> User
            CreateMap<RegisterCompanyRequestDto, User>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => Gender.None))
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => UserRole.Company))
                .ForMember(dest => dest.BirthDate, opt => opt.MapFrom(src => src.FoundingDate))
                .ForMember(dest => dest.PhotoUrl, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => DateTime.UtcNow));


            // RegisterWithInviteRequestDto -> User
            CreateMap<RegisterWithInviteRequestDto, User>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(s => true))
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(s => DateTime.UtcNow));


            // UserInvitation -> User
            CreateMap<UserInvitation, User>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore());


            // User -> UserResponseDto
            CreateMap<User, UserResponseDto>();


            // User -> UserInfoResponseDto
            CreateMap<User, UserInfoResponseDto>();


            // UserRequestDto -> User 
            CreateMap<UserRequestDto, User>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.UpdatedDate, opt => opt.MapFrom(src => DateTime.UtcNow));


            // InviteUserRequestDto -> UserInvitation
            CreateMap<InviteUserRequestDto, UserInvitation>()
                .ForMember(dest => dest.IsUsed, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.ExpiresDate, opt => opt.MapFrom(src => DateTime.UtcNow.AddDays(1)))
                .ForMember(dest => dest.CompanyId, opt => opt.Ignore());


            // Assignment -> AssignmentResponseDto
            CreateMap<Assignment, AssignmentResponseDto>();


            // AssignmentRequestDto -> Assignment
            CreateMap<AssignmentRequestDto, Assignment>()
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => StatusType.Pending));


            // HealthProfileRequestDto -> HealthProfile 
            CreateMap<HealthProfileRequestDto, HealthProfile>()
              .ForMember(dest => dest.ChronicDisease, opt => opt.MapFrom(src => src.ChronicDisease ?? string.Empty));


            // HealthProfile -> HealthProfileResponseDto
            CreateMap<HealthProfile, HealthProfileResponseDto>()
                .ForMember(dest => dest.ChronicDisease, opt => opt.MapFrom(src => src.ChronicDisease ?? string.Empty));


            // SafetyFinding -> SafetyFindingResponseDto
            CreateMap<SafetyFinding, SafetyFindingResponseDto>();

            // NotificationRequestDto -> Notification
            CreateMap<NotificationRequestDto, Notification>();

            // Notification -> NotificationResponseDto
            CreateMap<Notification, NotificationResponseDto>();
        }
    }
}