using IsimSaglik.Entity.Enums;
using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace IsimSaglik.Repository.Concrete
{
    public class DeviceTokenRepository : RepositoryBase<DeviceToken>, IDeviceTokenRepository
    {
        public DeviceTokenRepository(IConfiguration configuration) : base(configuration)
        {
        }


        public override async Task CreateAsync(DeviceToken entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_create_device_token", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_user_id", NpgsqlTypes.NpgsqlDbType.Uuid, entity.UserId);
            command.Parameters.AddWithValue("p_token", NpgsqlTypes.NpgsqlDbType.Text, entity.Token);
            command.Parameters.AddWithValue("p_device_type", NpgsqlTypes.NpgsqlDbType.Smallint, (short)entity.DeviceType);
            command.Parameters.AddWithValue("p_created_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, entity.CreatedDate);

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


        public override Task UpdateAsync(DeviceToken entity)
        {
            throw new NotImplementedException();
        }


        public override Task DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }


        public async Task DeleteByTokenAsync(string token)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_delete_device_token_by_token", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_token", NpgsqlTypes.NpgsqlDbType.Text, token);

            await command.ExecuteNonQueryAsync();
        }


        public override Task<DeviceToken?> GetByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }


        public override Task<IEnumerable<DeviceToken>> GetAllAsync()
        {
            throw new NotImplementedException();
        }


        public async Task<IEnumerable<DeviceToken>?> GetTokensByUserIdAsync(Guid userId)
        {
            var tokens = new List<DeviceToken>();

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_device_tokens_by_user_id(@p_user_id)", connection);
            command.Parameters.AddWithValue("p_user_id", userId);

            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var token = new DeviceToken
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    UserId = reader.GetGuid(reader.GetOrdinal("user_id")),
                    Token = reader.GetString(reader.GetOrdinal("token")),
                    DeviceType = (DeviceType)reader.GetInt16(reader.GetOrdinal("device_type")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date"))
                };

                tokens.Add(token);
            }

            return tokens.Count > 0 ? tokens : null;
        }
    }
}