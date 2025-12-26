using IsimSaglik.Service.Abstract;

namespace IsimSaglik.Service.Concrete
{
    public class ServiceManager : IServiceManager
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


        public IAuthService Auth => _authService;

        public IUserService User => _userService;
    }
}
