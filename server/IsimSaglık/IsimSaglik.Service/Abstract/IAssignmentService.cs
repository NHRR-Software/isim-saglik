using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;

namespace IsimSaglik.Service.Abstract
{
    public interface IAssignmentService
    {
        Task<IEnumerable<AssignmentResponseDto>> GetAllByUserIdAsync(Guid userId);

        Task<AssignmentResponseDto> CreateAsync(Guid userId, AssignmentRequestDto dto);

        Task<AssignmentResponseDto> UpdateAsync(Guid userId, Guid assignmentId, AssignmentRequestDto dto);

        Task DeleteAsync(Guid userId, Guid assignmentId);
    }
}