using AutoMapper;
using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;
using IsimSaglik.Entity.Enums;
using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;
using IsimSaglik.Service.Abstract;
using IsimSaglik.Service.Exceptions;
using IsimSaglik.Service.Exceptions.Types;

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
                responseDto.IsSetupCompleted = await _repositoryManager.HealthProfile.GetByUserIdAsync(userId) is not null ? false : true;
            }

            return responseDto;
        }

        public async Task<UserResponseDto> UpdateAsync(Guid userId, UserRequestDto dto)
        {
            var user = await _repositoryManager.User.GetByIdAsync(userId)
                ?? throw new NotFoundException("User not found.", ErrorCodes.UserNotFound);

            _mapper.Map(dto, user);

            await _repositoryManager.User.UpdateAsync(user);

            return _mapper.Map<UserResponseDto>(user);

        }


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