using Supabase.Gotrue;
using Supabase.Gotrue.Interfaces;

namespace IsimSaglik.Infrastructure.Abstract
{
    public interface ISupabaseClient
    {
        IGotrueClient<User, Session> Auth { get; }
        IGotrueAdminClient<User> AdminAuth { get; }

        Task InitializeAsync();
        Task<Uri> UploadPhotoAsync(string bucketName, string folderPath, string fileName, byte[] fileBytes);
        Task DeleteFileAsync(string bucketName, string fileName);
    }
}