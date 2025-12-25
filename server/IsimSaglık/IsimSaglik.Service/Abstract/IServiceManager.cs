namespace IsimSaglik.Service.Abstract
{
    public interface IServiceManager
    {
        IAuthService AuthService { get; }

        IUserService UserService { get; }
    }
}