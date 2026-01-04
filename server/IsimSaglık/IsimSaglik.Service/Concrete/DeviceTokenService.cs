using AutoMapper;
using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;
using IsimSaglik.Service.Abstract;

namespace IsimSaglik.Service.Concrete
{
    public class DeviceTokenService : IDeviceTokenService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;


        public DeviceTokenService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }


        public async Task CreateTokenAsync(Guid userId, DeviceTokenRequestDto dto)
        {
            var deviceToken = _mapper.Map<DeviceToken>(dto);
            deviceToken.UserId = userId;
            deviceToken.CreatedDate = DateTime.UtcNow;

            await _repositoryManager.DeviceToken.CreateAsync(deviceToken);
        }


        public async Task DeleteTokenAsync(Guid userId, string token)
        {
            await _repositoryManager.DeviceToken.DeleteByTokenAsync(token);
        }
    }
}