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

            if (existingUser != null)
            {
                throw new BadRequestException("User already exists.", ErrorCodes.UserAlreadyExists);
            }

            var userInvitation = new UserInvitation
            {
                Email = dto.Email,
                Role = dto.Role,
                Token = Guid.NewGuid().ToString("N"),
                CompanyId = companyId,
                CreatedDate = DateTime.UtcNow,
                ExpiresDate = DateTime.UtcNow.AddDays(1),
                IsUsed = false
            };

            await _repositoryManager.UserInvitation.CreateAsync(userInvitation);


        }
    }
}