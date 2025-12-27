using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.Models;
using IsimSaglik.Infrastructure.Abstract;
using IsimSaglik.Repository.Abstract;
using IsimSaglik.Service.Abstract;
using IsimSaglik.Service.Exceptions;
using IsimSaglik.Service.Exceptions.Types;
using Newtonsoft.Json.Linq;

namespace IsimSaglik.Service.Concrete
{
    public class CompanyService : ICompanyService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly ISupabaseClient _supabaseClient;


        public CompanyService(IRepositoryManager repositoryManager,
            ISupabaseClient supabaseClient)
        {
            _repositoryManager = repositoryManager;
            _supabaseClient = supabaseClient;
        }


        public async Task InviteUserAsync(Guid companyId, InviteUserRequestDto dto) 
        {
            var existingUser = await _repositoryManager.User.GetByEmailAsync(dto.Email);

            if (existingUser is not null)
            {
                throw new BadRequestException($"User with email '{dto.Email}' already exists.", ErrorCodes.UserAlreadyExists);
            }

            var lastInvitation = await _repositoryManager.UserInvitation.GetInvitationByEmailAsync(dto.Email);

            if (lastInvitation is not null)
            {
                if (!lastInvitation.IsUsed && lastInvitation.ExpiresDate > DateTime.UtcNow)
                {
                    throw new BadRequestException("An active invitation already exists.", ErrorCodes.InvitationAlreadyActive);
                }
            }

            var inviteOptions = new Supabase.Gotrue.InviteUserByEmailOptions
            {
                RedirectTo = "https://app.isimsaglik.com/complete-registration"
            };

            try
            {
                await _supabaseClient.AdminAuth.InviteUserByEmail(dto.Email, inviteOptions);
            }
            catch (Exception ex)
            {
                throw new BadRequestException($"Failed to send invitation email: {ex.Message}", ErrorCodes.EmailSendingFailed);
            }

            var userInvitation = new UserInvitation
            {
                Email = dto.Email,
                Role = dto.Role,
                CompanyId = companyId,
                CreatedDate = DateTime.UtcNow,
                ExpiresDate = DateTime.UtcNow.AddDays(1),
                IsUsed = false
            };

            await _repositoryManager.UserInvitation.CreateAsync(userInvitation);
        }
    }
}