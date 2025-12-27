namespace IsimSaglik.Infrastructure.Abstract
{
    public interface ISupabaseClient
    {
        Supabase.Client Client { get; }

        Task InitializeAsync();
    }
}