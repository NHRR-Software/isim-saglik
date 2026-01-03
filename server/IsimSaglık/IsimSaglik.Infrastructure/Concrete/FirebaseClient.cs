using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using IsimSaglik.Infrastructure.Abstract;
using IsimSaglik.Infrastructure.Settings;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace IsimSaglik.Infrastructure.Concrete
{
    public class FirebaseClient : IFirebaseClient
    {
        private readonly FirebaseMessaging _messaging;


        public FirebaseClient(IOptions<FirebaseSettings> settings)
        {
            var config = settings.Value;

            if (FirebaseApp.DefaultInstance is null)
            {
                string privateKey = config.PrivateKey.Replace("\\n", "\n");

                var credentialParameters = new Dictionary<string, string>
                {
                    { "project_id", config.ProjectId },
                    { "private_key", privateKey },
                    { "client_email", config.ClientEmail }
                };

                string jsonCredential = JsonSerializer.Serialize(credentialParameters);

                FirebaseApp.Create(new AppOptions()
                {
                    Credential = GoogleCredential.FromJson(jsonCredential)
                });
            }

            _messaging = FirebaseMessaging.DefaultInstance;
        }


        public async Task SendNotificationAsync(string deviceToken, string title, string body)
        {
            var message = new Message()
            {
                Token = deviceToken,
                Notification = new Notification()
                {
                    Title = title,
                    Body = body
                },
            };

            await _messaging.SendAsync(message);
        }


        public async Task SendMulticastNotificationAsync(List<string> deviceTokens, string title, string body)
        {
            if (deviceTokens is null || deviceTokens.Count.Equals(0))
            {
                return;
            }

            const int BatchSize = 500;
            int totalCount = deviceTokens.Count;
            int processedCount = 0;

            while (processedCount < totalCount)
            {
                var batchTokens = deviceTokens.Skip(processedCount).Take(BatchSize).ToList();

                var message = new MulticastMessage()
                {
                    Tokens = batchTokens,
                    Notification = new Notification()
                    {
                        Title = title,
                        Body = body
                    }
                };

                await _messaging.SendEachForMulticastAsync(message);

                processedCount += BatchSize;
            }
        }
    }
}