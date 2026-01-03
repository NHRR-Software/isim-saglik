using IsimSaglik.Service.Abstract;

namespace IsimSaglik.Service.Concrete
{
    public class ServiceManager : IServiceManager
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        private readonly ICompanyService _companyService;
        private readonly IHealthProfileService _healthProfileService;
        private readonly IAssignmentService _assignmentService;
        private readonly ISafetyFindingService _safetyFindingService;
        private readonly INotificationService  _notificationService;
        private readonly ISensorLogService _sensorLogService;

        public ServiceManager(
            IAuthService authService,
            IUserService userService,
            ICompanyService companyService,
            IHealthProfileService healthProfileService,
            IAssignmentService assignmentService,
            ISafetyFindingService safetyFindingService,
            INotificationService notificationService,
            ISensorLogService sensorLogService)
        {
            _authService = authService;
            _userService = userService;
            _companyService = companyService;
            _healthProfileService = healthProfileService;
            _assignmentService = assignmentService;
            _safetyFindingService = safetyFindingService;
            _notificationService = notificationService;
            _sensorLogService = sensorLogService;
        }


        public IAuthService Auth => _authService;

        public IUserService User => _userService;

        public ICompanyService Company => _companyService;

        public IHealthProfileService HealthProfile => _healthProfileService;  

        public IAssignmentService Assignment => _assignmentService;

        public ISafetyFindingService SafetyFinding => _safetyFindingService;

        public INotificationService Notification => _notificationService;

        public ISensorLogService SensorLog => _sensorLogService;
    }
}