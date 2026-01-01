using AutoMapper;
using IsimSaglik.Entity.DTOs.Response;
using IsimSaglik.Entity.Enums;
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
                responseDto.IsSetupCompleted = await _repositoryManager.HealthProfile.GetHealthProfileByUserIdAsync(userId) is not null ? false : true;
            }

            return responseDto;
        }


        public async Task UpdateAsync(Guid userId) 
        {
            var user = await _repositoryManager.User.GetByIdAsync(userId)
                ?? throw new NotFoundException("User not found.", ErrorCodes.UserNotFound);


        }


        public async Task GetByCompanyIdAsync(Guid companyId) 
        {
            throw new NotImplementedException();
        }



    }
}