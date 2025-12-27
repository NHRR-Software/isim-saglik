using IsimSaglik.Repository.Abstract;

namespace IsimSaglik.Repository.Concrete
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly IAssignmentRepository _assignmentRepository;
        private readonly IHealthProfileRepository _healthProfileRepository;
        private readonly INotificationRepository _notificationRepository;
        private readonly ISafetyFindingRepository _safetyFindingRepository;
        private readonly IRefreshTokenRepository _tokenRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUserInvitationRepository _userInvitationRepository;


        public RepositoryManager(
            IAssignmentRepository assignmentRepository,
            IHealthProfileRepository healthProfileRepository,
            INotificationRepository notificationRepository,
            ISafetyFindingRepository safetyFindingRepository,
            IRefreshTokenRepository tokenRepository,
            IUserRepository userRepository,
            IUserInvitationRepository userInvitationRepository)
        {
            _assignmentRepository = assignmentRepository;
            _healthProfileRepository = healthProfileRepository;
            _notificationRepository = notificationRepository;
            _safetyFindingRepository = safetyFindingRepository;
            _tokenRepository = tokenRepository;
            _userRepository = userRepository;
            _userInvitationRepository = userInvitationRepository;
        }


        public IAssignmentRepository Assignment => _assignmentRepository;

        public IHealthProfileRepository HealthProfile => _healthProfileRepository;

        public INotificationRepository Notification => _notificationRepository;

        public ISafetyFindingRepository SafetyFinding => _safetyFindingRepository;

        public IRefreshTokenRepository Token => _tokenRepository;

        public IUserRepository User => _userRepository;

        public IUserInvitationRepository UserInvitation => _userInvitationRepository;
    }
}