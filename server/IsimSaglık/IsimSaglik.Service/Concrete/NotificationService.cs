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
    public class NotificationService : INotificationService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;


        public NotificationService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }


        public async Task<NotificationResponseDto> CreateAsync(Guid userId, NotificationRequestDto dto)
        {
            var notification = _mapper.Map<Notification>(dto);

            notification.UserId = userId;
            notification.CreatedDate = DateTime.UtcNow;

            await _repositoryManager.Notification.CreateAsync(notification);

            return _mapper.Map<NotificationResponseDto>(notification);
        }


        public async Task<IEnumerable<NotificationResponseDto>> GetAllByUserIdAsync(Guid userId)
        {
            var notifications = await _repositoryManager.Notification.GetNotificationsByUserIdAsync(userId)
                ?? throw new NotFoundException("No notifications found for this user.", ErrorCodes.ValidationError);

            return _mapper.Map<IEnumerable<NotificationResponseDto>>(notifications);
        }


        public async Task MarkAsReadAsync(Guid userId, Guid id)
        {
            var notification = await _repositoryManager.Notification.GetByIdAsync(id)
                ?? throw new NotFoundException("Notification not found.", ErrorCodes.UnexpectedError);

            if (!notification.UserId.Equals(userId))
            {
                throw new NotFoundException("Notification not found.", ErrorCodes.UnexpectedError);
            }

            if (notification.IsRead)
            {
                throw new BadRequestException("Notification is already read.", ErrorCodes.ValidationError);
            }

            notification.IsRead = true;
            notification.UpdatedDate = DateTime.UtcNow;

            await _repositoryManager.Notification.UpdateAsync(notification);
        }
    }
}