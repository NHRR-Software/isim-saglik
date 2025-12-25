using IsimSaglik.Repository.Abstract;

namespace IsimSaglik.Repository.Concrete
{
    public class RepositoryManager
    {
        private readonly IAssignmentRepository _assignmentRepository;
        private readonly IHealthProfileRepository _healthProfileRepository;
        private readonly INotificationRepository _notificationRepository;
        private readonly ISafetyFindingRepository _safetyFindingRepository;
        private readonly ITokenRepository _tokenRepository;
        private readonly IUserRepository _userRepository;


        public RepositoryManager(
            IAssignmentRepository assignmentRepository,
            IHealthProfileRepository healthProfileRepository,
            INotificationRepository notificationRepository,
            ISafetyFindingRepository safetyFindingRepository,
            ITokenRepository tokenRepository,
            IUserRepository userRepository)
        {
            _assignmentRepository = assignmentRepository;
            _healthProfileRepository = healthProfileRepository;
            _notificationRepository = notificationRepository;
            _safetyFindingRepository = safetyFindingRepository;
            _tokenRepository = tokenRepository;
            _userRepository = userRepository;
        }


        public IAssignmentRepository Assignment => _assignmentRepository;

        public IHealthProfileRepository HealthProfile => _healthProfileRepository;

        public INotificationRepository Notification => _notificationRepository;

        public ISafetyFindingRepository SafetyFinding => _safetyFindingRepository;

        public ITokenRepository Token => _tokenRepository;

        public IUserRepository User => _userRepository;
    }
}