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



        // REVIEW: Repository 'den null değer döndüğü durumda hata verir mi? Bu olağan bir durum. Hata vermemesi gerekli. Bunu test edelim.
        // REVIEW: Eğer mümkünse AutoMapper kullanımını ekleyelim.
        public async Task<IEnumerable<AssignmentResponseDto>> GetAllByUserIdAsync(Guid userId)
        {
            var assignments = await _repositoryManager.Assignment.GetAssignmentsByUserIdAsync(userId);

            var assignmentDtos = assignments.Select(a => new AssignmentResponseDto
            {
                Id = a.Id,
                Description = a.Description,
                Severity = a.Severity,
                Status = a.Status,
                CreatedDate = a.CreatedDate
            });

            return assignmentDtos;
        }



        // REVIEW: Eğer mümkünse AutoMapper kullanımını ekleyelim. Hem entity oluşturma için hem de response dto oluşturma için.
        public async Task<AssignmentResponseDto> CreateAsync(Guid userId, AssignmentRequestDto dto)
        {
            var assignment = new Assignment
            {
                UserId = userId,
                Description = dto.Description,
                Severity = dto.Severity,
                Status = StatusType.Pending, 
                CreatedDate = DateTime.UtcNow
            };

            await _repositoryManager.Assignment.CreateAsync(assignment);

            var responseDto = new AssignmentResponseDto
            {
                Id = assignment.Id,
                Description = assignment.Description,
                Severity = assignment.Severity,
                Status = assignment.Status,
                CreatedDate = assignment.CreatedDate
            };

            return responseDto;
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