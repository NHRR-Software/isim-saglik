using IsimSaglik.Infrastructure.Abstract;
using IsimSaglik.Infrastructure.Settings;
using Microsoft.Extensions.Options;
using Supabase.Gotrue;
using Supabase.Gotrue.Interfaces;
using Supabase.Storage;
using Supabase.Storage.Interfaces;

namespace IsimSaglik.Infrastructure.Concrete
{
    public class SupabaseClient : ISupabaseClient
    {
        private readonly Supabase.Client _client;


        public IGotrueClient<User, Session> Auth { get; }
        public IGotrueAdminClient<User> AdminAuth { get; }
        public IStorageClient<Bucket, FileObject> Storage { get; }


        public SupabaseClient(IOptions<SupabaseSettings> settings)
        {
            var config = settings.Value ?? throw new ArgumentNullException(nameof(settings));

            var options = new Supabase.SupabaseOptions
            {
                AutoRefreshToken = true,
                AutoConnectRealtime = false
            };

            _client = new Supabase.Client(config.Url, config.Key, options);

            Auth = _client.Auth;
            Storage = _client.Storage;
            AdminAuth = _client.AdminAuth(config.ServiceRoleKey);
        }


        public async Task InitializeAsync()
        {
            await _client.InitializeAsync();
        }
    }
}