namespace IsimSaglik.Infrastructure.Abstract
{
    public interface IFirebaseClient
    {
        Task SendNotificationAsync(string deviceToken, string title, string body);

        Task SendMulticastNotificationAsync(List<string> deviceTokens, string title, string body);
    }
}