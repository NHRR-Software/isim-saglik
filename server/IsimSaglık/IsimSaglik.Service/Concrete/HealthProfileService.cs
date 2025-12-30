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



        public HealthProfileService(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }



        public async Task CreateAsync(Guid userId, HealthProfileRequestDto dto)
        {
            var existingHealthProfile = await _repositoryManager.HealthProfile.GetHealthProfileByUserIdAsync(userId);

            if (existingHealthProfile is not null)
            {
                throw new BadRequestException("Health profile already exists for this user.", ErrorCodes.ValidationError);
            }

            // REVIEW: Eğer mümkünse AutoMapper kullanımını ekleyelim.
            var healthProfile = new HealthProfile
            {
                UserId = userId,
                BloodGroup = dto.BloodGroup,
                Weight = dto.Weight,
                Height = dto.Height,
                ChronicDisease = dto.ChronicDisease ?? string.Empty,
                CreatedDate = DateTime.UtcNow
            };

            await _repositoryManager.HealthProfile.CreateAsync(healthProfile);
        }



        public async Task UpdateAsync(Guid userId, HealthProfileRequestDto dto)
        {
            var existingHealthProfile = await _repositoryManager.HealthProfile.GetHealthProfileByUserIdAsync(userId)
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
            var healthProfile = await _repositoryManager.HealthProfile.GetHealthProfileByUserIdAsync(userId)
                ?? throw new NotFoundException("Health profile not found for this user.", ErrorCodes.UserNotFound);

            // REVIEW: Eğer mümkünse AutoMapper kullanımını ekleyelim.
            // REVIEW: Değişken isimlendirmelerinde camelCase kullanalım. 'healthProfileResponse' şeklinde.
            var HealthProfileResponse = new HealthProfileResponseDto
            {
                BloodGroup = healthProfile.BloodGroup,
                Weight = healthProfile.Weight,
                Height = healthProfile.Height,
                ChronicDisease = healthProfile.ChronicDisease ?? string.Empty
            };

            return HealthProfileResponse;
        }
    }
}