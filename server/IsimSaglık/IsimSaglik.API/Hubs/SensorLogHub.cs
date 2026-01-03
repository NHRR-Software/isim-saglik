using IsimSaglik.Entity.DTOs.Request;
using Microsoft.AspNetCore.SignalR;

namespace IsimSaglik.API.Hubs
{
    public sealed class SensorLogHub : Hub
    {
        public async Task SendSensorData(LiveSensorLogDto dto)
        {
            try
            {
                await Clients.Group($"Tracking_{dto.UserId}").SendAsync("ReceiveSensorData", dto);
            }
            catch (Exception)
            {
                throw new HubException("An error occurred while transmitting sensor data.");
            }
        }


        public async Task SubscribeToUser(Guid userId)
        {
            if (userId.Equals(Guid.Empty))
            {
                throw new HubException("Invalid Target User ID.");
            }

            try
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"Tracking_{userId}");
            }
            catch (Exception)
            {
                throw new HubException("Could not subscribe to the user data stream.");
            }
        }


        public async Task UnsubscribeFromUser(Guid targetUserId)
        {
            try
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Tracking_{targetUserId}");
            }
            catch (Exception)
            {
                throw new HubException("Could not unsubscribe from the user data stream.");
            }
        }
    }
}