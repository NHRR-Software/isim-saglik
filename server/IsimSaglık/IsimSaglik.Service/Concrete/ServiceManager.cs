using IsimSaglik.Service.Abstract;

namespace IsimSaglik.Service.Concrete
{
    internal class ServiceManager : IServiceManager
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;


        public ServiceManager(
            IAuthService authService,
            IUserService userService)
        {
            _authService = authService;
            _userService = userService;
        }


        public IAuthService AuthService => _authService;

        public IUserService UserService => _userService;
    }
}
