namespace IsimSaglik.Service.Abstract
{
    public interface IServiceManager
    {
        IAuthService Auth { get; }

        IUserService User { get; }

        ICompanyService Company { get; }

        IHealthProfileService HealthProfile { get; }

        IAssignmentService Assignment { get; }

        ISafetyFindingService SafetyFinding { get; }

        INotificationService Notification { get; }
    }
}