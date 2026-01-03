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
    public class SensorLogService : ISensorLogService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        
        public SensorLogService(
            IRepositoryManager repositoryManager,
            IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }


        public async Task CreateAsync(Guid userId, SensorLogRequestDto dto) 
        {
            var sensorLog = _mapper.Map<SensorLog>(dto);
            sensorLog.UserId = userId;
            sensorLog.CreatedDate = DateTime.UtcNow;

            await _repositoryManager.SensorLog.CreateAsync(sensorLog);
        }


        public async Task<SensorLogResponseDto> GetByUserIdAsync(Guid userId)
        {
            var latestLog = await _repositoryManager.SensorLog.GetLatestByUserIdAsync(userId)
                ?? throw new NotFoundException("No sensor data found for this user.", ErrorCodes.ValidationError);

            var historyLogs = await _repositoryManager.SensorLog.GetHistoryByUserIdAsync(userId, DateTime.UtcNow.Date, DateTime.UtcNow);

            var responseDto = new SensorLogResponseDto
            {
                CurrentData = _mapper.Map<SensorDataDto>(latestLog),
                HistoryData = historyLogs != null ? _mapper.Map<IEnumerable<SensorDataDto>>(historyLogs) : new List<SensorDataDto>(),
                LastUpdateDate = latestLog.RecordedDate
            };

            return responseDto;
        }
    }
}