using AutoMapper;
using IsimSaglik.Entity.DTOs.Request;
using IsimSaglik.Entity.DTOs.Response;
using IsimSaglik.Entity.Models;
using IsimSaglik.Infrastructure.Abstract;
using IsimSaglik.Repository.Abstract;
using IsimSaglik.Service.Abstract;
using IsimSaglik.Service.Exceptions;
using IsimSaglik.Service.Exceptions.Types;

namespace IsimSaglik.Service.Concrete
{
    public class NotificationService : INotificationService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IFirebaseClient _firebaseClient;
        private readonly IMapper _mapper;


        public NotificationService(
            IRepositoryManager repositoryManager,
            IFirebaseClient firebaseClient,
            IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _firebaseClient = firebaseClient;
            _mapper = mapper;
        }


        public async Task CreateAsync(Guid userId, NotificationRequestDto dto)
        {
            var notification = _mapper.Map<Notification>(dto);

            notification.UserId = userId;
            notification.CreatedDate = DateTime.UtcNow;

            await _repositoryManager.Notification.CreateAsync(notification);

            var users = await _repositoryManager.User.GetByCompanyIdAsync(userId)
                ?? throw new NotFoundException("No users found in the company.", ErrorCodes.ValidationError);

            foreach (var user in users)
            {
                var deviceTokens = await _repositoryManager.DeviceToken.GetTokensByUserIdAsync(user.Id);

                if (deviceTokens is not null)
                {
                    var tokens = deviceTokens.Select(dt => dt.Token).ToList();

                    await _firebaseClient.SendMulticastNotificationAsync(
                        tokens,
                        dto.Title,
                        dto.Description);
                }
            }
        }


        public async Task<IEnumerable<NotificationResponseDto>> GetAllByUserIdAsync(Guid userId)
        {
            var notifications = await _repositoryManager.Notification.GetNotificationsByUserIdAsync(userId)
                ?? throw new NotFoundException("No notifications found for this user.", ErrorCodes.ValidationError);

            return _mapper.Map<IEnumerable<NotificationResponseDto>>(notifications);
        }


        public async Task<NotificationResponseDto> MarkAsReadAsync(Guid userId, Guid id)
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

            return _mapper.Map<NotificationResponseDto>(notification);
        }


        public async Task DeleteAsync(Guid userId, Guid notificationId)
        {
            var notification = await _repositoryManager.Notification.GetByIdAsync(notificationId)
                ?? throw new NotFoundException("Notification not found.", ErrorCodes.ValidationError);

            if (!notification.UserId.Equals(userId))
            {
                throw new BadRequestException("You are not authorized to delete this notification.", ErrorCodes.ValidationError);
            }

            await _repositoryManager.Notification.DeleteAsync(notificationId);
        }
    }
}