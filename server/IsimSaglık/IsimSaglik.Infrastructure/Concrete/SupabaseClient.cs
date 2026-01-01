using IsimSaglik.Infrastructure.Abstract;
using IsimSaglik.Infrastructure.Settings;
using Microsoft.Extensions.Options;
using Supabase.Gotrue;
using Supabase.Gotrue.Interfaces;
using Supabase.Storage;

namespace IsimSaglik.Infrastructure.Concrete
{
    public class SupabaseClient : ISupabaseClient
    {
        private readonly Supabase.Client _client;


        public IGotrueClient<User, Session> Auth { get; }
        public IGotrueAdminClient<User> AdminAuth { get; }


        public SupabaseClient(IOptions<SupabaseSettings> settings)
        {
            var config = settings.Value ?? throw new ArgumentNullException(nameof(settings));

            var options = new Supabase.SupabaseOptions
            {
                AutoRefreshToken = true,
                AutoConnectRealtime = false
            };

            _client = new Supabase.Client(config.Url, config.ServiceRoleKey, options);

            Auth = _client.Auth;
            AdminAuth = _client.AdminAuth(config.ServiceRoleKey);
        }


        public async Task InitializeAsync()
        {
            await _client.InitializeAsync();
        }


        public async Task<Uri> UploadPhotoAsync(string bucketName, string folderPath, string fileName, byte[] fileBytes)
        {
            var fullPath = string.IsNullOrEmpty(folderPath)
                ? $"{fileName}.webp"
                : $"{folderPath}/{fileName}.webp";

            var uploadOptions = new Supabase.Storage.FileOptions
            {
                Upsert = true, 
                ContentType = "image/webp"
            };

            await _client.Storage
                .From(bucketName)
                .Upload(fileBytes, fullPath, uploadOptions);

            var urlString = _client.Storage
                .From(bucketName)
                .GetPublicUrl(fullPath);

            return new Uri(urlString);
        }


        public async Task DeleteFileAsync(string bucketName, string fileName)
        {
            await _client.Storage
                .From(bucketName)
                .Remove([fileName]);
        }
    }
}