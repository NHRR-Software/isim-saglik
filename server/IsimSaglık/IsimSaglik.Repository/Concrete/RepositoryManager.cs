using IsimSaglik.Repository.Abstract;

namespace IsimSaglik.Repository.Concrete
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly IAssignmentRepository _assignmentRepository;
        private readonly IHealthProfileRepository _healthProfileRepository;
        private readonly INotificationRepository _notificationRepository;
        private readonly ISafetyFindingRepository _safetyFindingRepository;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUserInvitationRepository _userInvitationRepository;
        private readonly ISensorLogRepository _sensorLogRepository;
        private readonly IDeviceTokenRepository _deviceTokenRepository;


        public RepositoryManager(
            IAssignmentRepository assignmentRepository,
            IHealthProfileRepository healthProfileRepository,
            INotificationRepository notificationRepository,
            ISafetyFindingRepository safetyFindingRepository,
            IRefreshTokenRepository refreshTokenRepository,
            IUserRepository userRepository,
            IUserInvitationRepository userInvitationRepository,
            ISensorLogRepository sensorLogRepository,
            IDeviceTokenRepository deviceTokenRepository)
        {
            _assignmentRepository = assignmentRepository;
            _healthProfileRepository = healthProfileRepository;
            _notificationRepository = notificationRepository;
            _safetyFindingRepository = safetyFindingRepository;
            _refreshTokenRepository = refreshTokenRepository;
            _userRepository = userRepository;
            _userInvitationRepository = userInvitationRepository;
            _sensorLogRepository = sensorLogRepository;
            _deviceTokenRepository = deviceTokenRepository;
        }


        public IAssignmentRepository Assignment => _assignmentRepository;

        public IHealthProfileRepository HealthProfile => _healthProfileRepository;

        public INotificationRepository Notification => _notificationRepository;

        public ISafetyFindingRepository SafetyFinding => _safetyFindingRepository;

        public IRefreshTokenRepository RefreshToken => _refreshTokenRepository;

        public IUserRepository User => _userRepository;

        public IUserInvitationRepository UserInvitation => _userInvitationRepository;

        public ISensorLogRepository SensorLog => _sensorLogRepository;

        public IDeviceTokenRepository DeviceToken => _deviceTokenRepository;
    }
}