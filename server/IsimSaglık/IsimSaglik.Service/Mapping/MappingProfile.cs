using AutoMapper;
using IsimSaglik.Entity.DTOs.Request;
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
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
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

            // InviteUserRequestDto -> UserInvitation
            CreateMap<InviteUserRequestDto, UserInvitation>()
                .ForMember(dest => dest.IsUsed, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.ExpiresDate, opt => opt.MapFrom(src => DateTime.UtcNow.AddDays(1)))
                .ForMember(dest => dest.CompanyId, opt => opt.Ignore());
        }
    }
}
