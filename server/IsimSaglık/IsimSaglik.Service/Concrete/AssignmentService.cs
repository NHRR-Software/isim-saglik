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
    public class AssignmentService : IAssignmentService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;


        public AssignmentService(
            IRepositoryManager repositoryManager,
            IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }



        public async Task<IEnumerable<AssignmentResponseDto>> GetAllByUserIdAsync(Guid userId)
        {
            var assignments = await _repositoryManager.Assignment.GetByUserIdAsync(userId);

            if (assignments is null)
            {
                return Enumerable.Empty<AssignmentResponseDto>();
            }

            return _mapper.Map<IEnumerable<AssignmentResponseDto>>(assignments);
        }



        public async Task<AssignmentResponseDto> CreateAsync(Guid userId, AssignmentRequestDto dto)
        {
            var assignment = _mapper.Map<Assignment>(dto);

            assignment.UserId = userId;
            assignment.Status = StatusType.Pending;
            assignment.CreatedDate = DateTime.UtcNow;

            await _repositoryManager.Assignment.CreateAsync(assignment);

            return _mapper.Map<AssignmentResponseDto>(assignment);
        }



        public async Task<AssignmentResponseDto> UpdateAsync(Guid userId, Guid id, AssignmentRequestDto dto)
        {
            var assignment = await _repositoryManager.Assignment.GetByIdAsync(id)
                ?? throw new NotFoundException("Assignment not found.", ErrorCodes.ValidationError);

            if (!assignment.UserId.Equals(userId))
            {
                throw new BadRequestException("You are not authorized to update this assignment.", ErrorCodes.ValidationError);
            }

            assignment.Description = dto.Description;
            assignment.Severity = dto.Severity;
            assignment.Status = dto.Status;
            assignment.UpdatedDate = DateTime.UtcNow;

            await _repositoryManager.Assignment.UpdateAsync(assignment);

            var responseDto = _mapper.Map<AssignmentResponseDto>(assignment);

            return responseDto;
        }



        public async Task DeleteAsync(Guid userId, Guid id)
        {
            var assignment = await _repositoryManager.Assignment.GetByIdAsync(id)
                ?? throw new NotFoundException("Assignment not found.", ErrorCodes.ValidationError);

            if (!assignment.UserId.Equals(userId))
            {
                throw new BadRequestException("You are not authorized to delete this assignment.", ErrorCodes.ValidationError);
            }

            await _repositoryManager.Assignment.DeleteAsync(id);
        }
    }
}