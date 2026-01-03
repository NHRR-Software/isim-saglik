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

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_all_notifications()", connection);

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

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_notification_by_id(@p_id)", connection);
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


        public async Task<IEnumerable<Notification>?> GetNotificationsByUserIdAsync(Guid userId)
        {
            var notifications = new List<Notification>();

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_notifications_by_user_id(@p_user_id)", connection);
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

            return notifications.Count > 0 ? notifications : null ;
        }


        public override async Task CreateAsync(Notification entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_create_notification", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_created_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, entity.CreatedDate);
            command.Parameters.AddWithValue("p_updated_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, (object)entity.UpdatedDate ?? DBNull.Value);
            command.Parameters.AddWithValue("p_title", NpgsqlTypes.NpgsqlDbType.Text, entity.Title);
            command.Parameters.AddWithValue("p_description", NpgsqlTypes.NpgsqlDbType.Text, entity.Description);
            command.Parameters.AddWithValue("p_is_read", NpgsqlTypes.NpgsqlDbType.Boolean, entity.IsRead);
            command.Parameters.AddWithValue("p_type", NpgsqlTypes.NpgsqlDbType.Smallint, (short)entity.Type);
            command.Parameters.AddWithValue("p_user_id", NpgsqlTypes.NpgsqlDbType.Uuid, entity.UserId);

            command.Parameters.Add(new NpgsqlParameter("p_id", NpgsqlTypes.NpgsqlDbType.Uuid)
            {
                Direction = ParameterDirection.InputOutput,
                Value = DBNull.Value
            });

            await command.ExecuteNonQueryAsync();

            if (command.Parameters["p_id"].Value != DBNull.Value)
            {
                entity.Id = (Guid)command.Parameters["p_id"].Value;
            }
        }


        public override async Task UpdateAsync(Notification entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_update_notification", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", NpgsqlTypes.NpgsqlDbType.Uuid, entity.Id);
            command.Parameters.AddWithValue("p_created_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, entity.CreatedDate);
            command.Parameters.AddWithValue("p_updated_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, (object)entity.UpdatedDate ?? DBNull.Value);
            command.Parameters.AddWithValue("p_title", NpgsqlTypes.NpgsqlDbType.Text, entity.Title);
            command.Parameters.AddWithValue("p_description", NpgsqlTypes.NpgsqlDbType.Text, entity.Description);
            command.Parameters.AddWithValue("p_is_read", NpgsqlTypes.NpgsqlDbType.Boolean, entity.IsRead);
            command.Parameters.AddWithValue("p_type", NpgsqlTypes.NpgsqlDbType.Smallint, (short)entity.Type);
            command.Parameters.AddWithValue("p_user_id", NpgsqlTypes.NpgsqlDbType.Uuid, entity.UserId);

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

            command.Parameters.AddWithValue("p_id", NpgsqlTypes.NpgsqlDbType.Uuid, id);

            await command.ExecuteNonQueryAsync();
        }
    }
}