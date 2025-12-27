using IsimSaglik.Service.Abstract;

namespace IsimSaglik.Service.Concrete
{
    public class ServiceManager : IServiceManager
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        private readonly ICompanyService _companyService;


        public ServiceManager(
            IAuthService authService,
            IUserService userService,
            ICompanyService companyService)
        {
            _authService = authService;
            _userService = userService;
            _companyService = companyService;
        }


        public IAuthService Auth => _authService;

        public IUserService User => _userService;

        public ICompanyService Company => _companyService;
    }
}
