using AutoMapper;
using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;
using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;
using IsimSaglik.Service.Abstract;
using IsimSaglik.Service.Exceptions;
using IsimSaglik.Service.Exceptions.Types;

namespace IsimSaglik.Service.Concrete
{
    public class HealthProfileService : IHealthProfileService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;



        public HealthProfileService(IRepositoryManager repositoryManager,
            IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }



        public async Task CreateAsync(Guid userId, HealthProfileRequestDto dto)
        {
            var existingHealthProfile = await _repositoryManager.HealthProfile.GetByUserIdAsync(userId);

            if (existingHealthProfile is not null)
            {
                throw new BadRequestException("Health profile already exists for this user.", ErrorCodes.ValidationError);
            }

            var healthProfile = _mapper.Map<HealthProfile>(dto);

            healthProfile.UserId = userId;
            healthProfile.CreatedDate = DateTime.UtcNow;

            await _repositoryManager.HealthProfile.CreateAsync(healthProfile);
        }



        public async Task UpdateAsync(Guid userId, HealthProfileRequestDto dto)
        {
            var existingHealthProfile = await _repositoryManager.HealthProfile.GetByUserIdAsync(userId)
                ?? throw new NotFoundException("Health profile not found for this user.", ErrorCodes.UserNotFound);

            existingHealthProfile.BloodGroup = dto.BloodGroup;
            existingHealthProfile.Weight = dto.Weight;
            existingHealthProfile.Height = dto.Height;
            existingHealthProfile.ChronicDisease = dto.ChronicDisease ?? string.Empty;
            existingHealthProfile.UpdatedDate = DateTime.UtcNow;

            await _repositoryManager.HealthProfile.UpdateAsync(existingHealthProfile);
        }



        public async Task<HealthProfileResponseDto> GetByUserIdAsync(Guid userId)
        {
            var healthProfile = await _repositoryManager.HealthProfile.GetByUserIdAsync(userId)
                ?? throw new NotFoundException("Health profile not found for this user.", ErrorCodes.UserNotFound);

            return _mapper.Map<HealthProfileResponseDto>(healthProfile);
        }
    }
}