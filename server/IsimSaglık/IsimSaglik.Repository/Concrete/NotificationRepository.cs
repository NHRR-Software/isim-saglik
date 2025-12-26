using IsimSaglik.Entity.Enums;
using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace IsimSaglik.Repository.Concrete
{
    public class NotificationRepository : RepositoryBase<Notification>, INotificationRepository
    {
        public NotificationRepository(IConfiguration configuration) : base(configuration)
        {
        }


        public override async Task<IEnumerable<Notification>> GetAllAsync()
        {
            var findings = new List<Notification>();

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_get_all_notifications", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                findings.Add(new Notification
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    Title = reader.GetString(reader.GetOrdinal("title")),
                    Description = reader.GetString(reader.GetOrdinal("description")),
                    IsRead = reader.GetBoolean(reader.GetOrdinal("is_read")),
                    Type = (NotificationType)reader.GetInt16(reader.GetOrdinal("type")),
                    UserId = reader.GetGuid(reader.GetOrdinal("user_id"))
                });
            }

            return findings;
        }


        public override async Task<Notification?> GetByIdAsync(Guid id)
        {
            Notification? notification = null;

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_get_notification_by_id", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", id);

            await using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                notification = new Notification
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    Title = reader.GetString(reader.GetOrdinal("title")),
                    Description = reader.GetString(reader.GetOrdinal("description")),
                    IsRead = reader.GetBoolean(reader.GetOrdinal("is_read")),
                    Type = (NotificationType)reader.GetInt16(reader.GetOrdinal("type")),
                    UserId = reader.GetGuid(reader.GetOrdinal("user_id"))
                };
            }

            return notification;
        }


        public async Task<IEnumerable<Notification>> GetNotificationsByUserIdAsync(Guid userId)
        {
            var notifications = new List<Notification>();

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_get_notifications_by_user_id", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_user_id", userId);

            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                notifications.Add(new Notification
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    Title = reader.GetString(reader.GetOrdinal("title")),
                    Description = reader.GetString(reader.GetOrdinal("description")),
                    IsRead = reader.GetBoolean(reader.GetOrdinal("is_read")),
                    Type = (NotificationType)reader.GetInt16(reader.GetOrdinal("type")),
                    UserId = reader.GetGuid(reader.GetOrdinal("user_id"))
                });
            }

            return notifications;
        }


        public override async Task CreateAsync(Notification entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_create_notification", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_created_date", entity.CreatedDate);
            command.Parameters.AddWithValue("p_updated_date", (object)entity.UpdatedDate ?? DBNull.Value);
            command.Parameters.AddWithValue("p_title", entity.Title);
            command.Parameters.AddWithValue("p_description", entity.Description);
            command.Parameters.AddWithValue("p_is_read", entity.IsRead);
            command.Parameters.AddWithValue("p_type", (short)entity.Type);
            command.Parameters.AddWithValue("p_user_id", entity.UserId);

            await command.ExecuteScalarAsync();
        }


        public override async Task UpdateAsync(Notification entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_update_notification", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", entity.Id);
            command.Parameters.AddWithValue("p_created_date", entity.CreatedDate);
            command.Parameters.AddWithValue("p_updated_date", (object)entity.UpdatedDate ?? DBNull.Value);
            command.Parameters.AddWithValue("p_title", entity.Title);
            command.Parameters.AddWithValue("p_description", entity.Description);
            command.Parameters.AddWithValue("p_is_read", entity.IsRead);
            command.Parameters.AddWithValue("p_type", (short)entity.Type);
            command.Parameters.AddWithValue("p_user_id", entity.UserId);

            await command.ExecuteNonQueryAsync();
        }


        public override async Task DeleteAsync(Guid id)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_delete_notification", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", id);

            await command.ExecuteNonQueryAsync();
        }
    }
}