using AutoMapper;
using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;
using IsimSaglik.Entity.Enums;
using IsimSaglik.Repository.Abstract;
using IsimSaglik.Service.Abstract;
using IsimSaglik.Service.Exceptions;
using IsimSaglik.Service.Exceptions.Types;
using IsimSaglik.Service.Utilities;

namespace IsimSaglik.Service.Concrete
{
    public class UserService : IUserService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;


        public UserService(
            IRepositoryManager repositoryManager,
            IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }


        public async Task<UserResponseDto> GetByIdAsync(Guid userId)
        {
            var user = await _repositoryManager.User.GetByIdAsync(userId)
                ?? throw new NotFoundException("User not found.", ErrorCodes.UserNotFound);

            var responseDto = _mapper.Map<UserResponseDto>(user);

            if (user.Role.Equals(UserRole.Worker) || user.Role.Equals(UserRole.Expert))
            {
                responseDto.IsSetupCompleted = await _repositoryManager.HealthProfile.GetByUserIdAsync(userId) is null ? false : true;
            }

            return responseDto;
        }


        public async Task<UserResponseDto> UpdateAsync(Guid userId, UserRequestDto dto)
        {
            var user = await _repositoryManager.User.GetByIdAsync(userId)
                ?? throw new NotFoundException("User not found.", ErrorCodes.UserNotFound);

            _mapper.Map(dto, user);
            user.UpdatedDate = DateTime.UtcNow;
            user.PhotoUrl = AvatarResolver.GetDefaultUri(user.Role, user.Gender);

            await _repositoryManager.User.UpdateAsync(user);

            return _mapper.Map<UserResponseDto>(user);
        }


        // TODO: Profil fotoğrafı güncelleme işlemi eklenecek. Şimdilik bu işlem iptal edildi.


        public async Task<IEnumerable<UserInfoResponseDto>> GetByCompanyIdAsync(Guid companyId)
        {
            var users = await _repositoryManager.User.GetByCompanyIdAsync(companyId)
                ?? throw new NotFoundException("No users found for the specified company.", ErrorCodes.UserNotFound);

            return _mapper.Map<IEnumerable<UserInfoResponseDto>>(users);
        }


        public async Task<UserInfoResponseDto> SearchUserAsync(string email) 
        {
            var user = await _repositoryManager.User.GetByEmailAsync(email)
                ?? throw new NotFoundException("User not found.", ErrorCodes.UserNotFound);

            return _mapper.Map<UserInfoResponseDto>(user);
        }
    }
}