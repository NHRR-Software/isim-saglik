using AutoMapper;
using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;
using IsimSaglik.Entity.Enums;
using IsimSaglik.Entity.Models;
using IsimSaglik.Infrastructure.Abstract;
using IsimSaglik.Repository.Abstract;
using IsimSaglik.Service.Abstract;
using IsimSaglik.Service.Exceptions;
using IsimSaglik.Service.Exceptions.Types;
using IsimSaglik.Service.Utilities;

namespace IsimSaglik.Service.Concrete
{
    public class SafetyFindingService : ISafetyFindingService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly ISupabaseClient _supabaseClient;
        private readonly IMapper _mapper;


        public SafetyFindingService(
            IRepositoryManager repositoryManager,
            ISupabaseClient supabaseClient,
            IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _supabaseClient = supabaseClient;
            _mapper = mapper;
        }


        public async Task<SafetyFindingResponseDto> CreateAsync(Guid userId, SafetyFindingRequestDto dto)
        {
            var user = await _repositoryManager.User.GetByIdAsync(userId)
              ?? throw new NotFoundException("User not found.", ErrorCodes.UserNotFound);

            if (dto.ReportedId is not null)
            {
                var reportedUser = await _repositoryManager.User.GetByIdAsync(dto.ReportedId.Value)
                  ?? throw new NotFoundException("Reported user not found.", ErrorCodes.UserNotFound);
            }

            var safetyFinding = new SafetyFinding
            {
                Title = dto.Title,
                Status = dto.Status,
                Severity = dto.Severity,
                Type = dto.Type,
                Description = dto.Description,
                PhotoUrl = !string.IsNullOrWhiteSpace(dto.Base64Image)
                    ? await _supabaseClient.UploadPhotoAsync("images", "safety-findings", Guid.NewGuid().ToString(), FileValidator.ValidateAndConvertPhoto(dto.Base64Image))
                    : null,
                CompanyId = user.CompanyId is null ? throw new BadRequestException("User does not belong to a company.", ErrorCodes.UnexpectedError) : user.CompanyId.Value,
                ReporterId = user.Id,
                ReportedId = dto.ReportedId,
                CreatedDate = DateTime.UtcNow,
            };

            await _repositoryManager.SafetyFinding.CreateAsync(safetyFinding);

            return _mapper.Map<SafetyFindingResponseDto>(safetyFinding);
        }


        public async Task MarkAsCompleted(Guid userId, Guid safetyFindingId)
        {
            var safetyFinding = await _repositoryManager.SafetyFinding.GetByIdAsync(safetyFindingId)
                    ?? throw new NotFoundException("Safety finding not found.", ErrorCodes.UnexpectedError);

            if (!safetyFinding.CompanyId.Equals(userId))
            {
                throw new NotFoundException("Safety finding not found.", ErrorCodes.UnexpectedError);
            }

            if (safetyFinding.Status.Equals(FindingStatus.Closed))
            {
                throw new BadRequestException("Safety finding is already closed.", ErrorCodes.ValidationError);
            }

            safetyFinding.Status = FindingStatus.Closed;
            safetyFinding.ClosedDate = DateTime.UtcNow;

            await _repositoryManager.SafetyFinding.UpdateAsync(safetyFinding);
        }


        public async Task DeleteAsync(Guid userId, Guid safetyFindingId)
        {
            var safetyFinding = await _repositoryManager.SafetyFinding.GetByIdAsync(safetyFindingId)
                    ?? throw new NotFoundException("Safety finding not found.", ErrorCodes.UnexpectedError);

            if (!safetyFinding.CompanyId.Equals(userId))
            {
                throw new NotFoundException("Safety finding not found.", ErrorCodes.UnexpectedError);
            }

            await _repositoryManager.SafetyFinding.DeleteAsync(safetyFindingId);
        }


        public async Task<IEnumerable<SafetyFindingResponseDto>> GetAllByUserIdAsync(Guid userId)
        {
            var user = await _repositoryManager.User.GetByIdAsync(userId)
                 ?? throw new NotFoundException("User not found.", ErrorCodes.UserNotFound);

            var safetyFindings = Enumerable.Empty<SafetyFinding>();

            if (user.Role.Equals(UserRole.Company)) 
            {
                safetyFindings = await _repositoryManager.SafetyFinding.GetByCompanyIdAsync(userId);
            }
            else
            {
                safetyFindings = await _repositoryManager.SafetyFinding.GetByReporterIdAsync(userId);
            }

            return _mapper.Map<IEnumerable<SafetyFindingResponseDto>>(safetyFindings);
        }
    }
}