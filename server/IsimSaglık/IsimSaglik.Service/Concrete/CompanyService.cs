using AutoMapper;
using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.Models;
using IsimSaglik.Infrastructure.Abstract;
using IsimSaglik.Repository.Abstract;
using IsimSaglik.Service.Abstract;
using IsimSaglik.Service.Exceptions;
using IsimSaglik.Service.Exceptions.Types;

namespace IsimSaglik.Service.Concrete
{
    public class CompanyService : ICompanyService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly ISupabaseClient _supabaseClient;
        private readonly IMapper _mapper;


        public CompanyService(
            IRepositoryManager repositoryManager,
            ISupabaseClient supabaseClient,
            IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _supabaseClient = supabaseClient;
            _mapper = mapper;
        }



        public async Task InviteUserAsync(Guid companyId, InviteUserRequestDto dto) 
        {
            var existingUser = await _repositoryManager.User.GetByEmailAsync(dto.Email);

            if (existingUser is not null)
            {
                throw new BadRequestException($"User with email '{dto.Email}' already exists.", ErrorCodes.UserAlreadyExists);
            }

            var lastInvitation = await _repositoryManager.UserInvitation.GetByEmailAsync(dto.Email);

            if (lastInvitation is not null)
            {
                if (!lastInvitation.IsUsed && lastInvitation.ExpiresDate > DateTime.UtcNow)
                {
                    throw new BadRequestException("An active invitation already exists.", ErrorCodes.InvitationAlreadyActive);
                }
            }

            var inviteOptions = new Supabase.Gotrue.InviteUserByEmailOptions
            {
                RedirectTo = "https://isimsaglik.netlify.app/register"
            };

            try
            {
                await _supabaseClient.AdminAuth.InviteUserByEmail(dto.Email, inviteOptions);
            }
            catch (Exception ex)
            {
                throw new BadRequestException($"Failed to send invitation email: {ex.Message}", ErrorCodes.EmailSendingFailed);
            }

            var userInvitation = _mapper.Map<UserInvitation>(dto);
            userInvitation.CompanyId = companyId;

            await _repositoryManager.UserInvitation.CreateAsync(userInvitation);
        }
    }
}