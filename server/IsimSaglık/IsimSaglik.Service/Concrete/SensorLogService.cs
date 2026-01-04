using AutoMapper;
using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;
using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;
using IsimSaglik.Service.Abstract;
using IsimSaglik.Service.Exceptions;
using IsimSaglik.Service.Exceptions.Types;
using IsimSaglik.Service.Utilities;

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


        public async Task<IEnumerable<AnalysisResult>> CreateAsync(Guid userId, SensorLogRequestDto dto)
        {
            foreach (var logDto in dto.SensorLogs)
            {
                var sensorLog = _mapper.Map<SensorLog>(logDto);
                sensorLog.UserId = userId;
                sensorLog.CreatedDate = DateTime.UtcNow;

                await _repositoryManager.SensorLog.CreateAsync(sensorLog);
            }

            var analysisResults = new List<AnalysisResult>();
            var latestLog = await _repositoryManager.SensorLog.GetLatestByUserIdAsync(userId);

            if (latestLog != null)
            {
                var historyLogs = await _repositoryManager.SensorLog.GetHistoryByUserIdAsync(userId, DateTime.UtcNow.AddDays(-1), DateTime.UtcNow);

                if (historyLogs is not null && historyLogs.Any())
                {
                    var results = HealthAnalyzer.Analyze(historyLogs, latestLog);
                    analysisResults.AddRange(results);
                }
            }

            return analysisResults;
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