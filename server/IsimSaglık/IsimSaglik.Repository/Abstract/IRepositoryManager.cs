namespace IsimSaglik.Repository.Abstract
{
    public interface IRepositoryManager
    {
        IAssignmentRepository Assignment { get; }

        IHealthProfileRepository HealthProfile { get; }

        INotificationRepository Notification { get; }

        ISafetyFindingRepository SafetyFinding { get; }

        IRefreshTokenRepository Token { get; }

        IUserRepository User { get; }

        IUserInvitationRepository UserInvitation { get; }
    }
}