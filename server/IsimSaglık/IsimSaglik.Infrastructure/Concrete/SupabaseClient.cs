using IsimSaglik.Infrastructure.Abstract;
using IsimSaglik.Infrastructure.Settings;
using Microsoft.Extensions.Options;

namespace IsimSaglik.Infrastructure.Concrete
{
    public class SupabaseClient : ISupabaseClient
    {
        public Supabase.Client Client { get; }

        public SupabaseClient(IOptions<SupabaseSettings> settings)
        {
            var config = settings.Value ?? throw new ArgumentNullException(nameof(settings));

            var options = new Supabase.SupabaseOptions
            {
                AutoRefreshToken = true,
                AutoConnectRealtime = false
            };

            Client = new Supabase.Client(config.Url, config.Key, options);
        }

        public async Task InitializeAsync()
        {
            await Client.InitializeAsync();
        }
    }
}