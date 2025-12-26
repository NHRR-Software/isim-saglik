namespace IsimSaglik.Service.Abstract
{
    public interface IServiceManager
    {
        IAuthService Auth { get; }

        IUserService User { get; }
    }
}