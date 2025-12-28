using Supabase.Gotrue;
using Supabase.Gotrue.Interfaces;
using Supabase.Storage;
using Supabase.Storage.Interfaces;

namespace IsimSaglik.Infrastructure.Abstract
{
    public interface ISupabaseClient
    {
        IGotrueClient<User, Session> Auth { get; }
        IGotrueAdminClient<User> AdminAuth { get; }
        IStorageClient<Bucket, FileObject> Storage { get; }

        Task InitializeAsync();
    }
}