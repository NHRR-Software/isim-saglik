using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace IsimSaglik.Repository.Concrete
{
    public class RefreshTokenRepository : RepositoryBase<RefreshToken>, IRefreshTokenRepository
    {
        public RefreshTokenRepository(IConfiguration configuration) : base(configuration)
        {
        }


        public override async Task<IEnumerable<RefreshToken>> GetAllAsync()
        {
            throw new NotImplementedException();
        }


        public override async Task<RefreshToken?> GetByIdAsync(Guid id)
        {
            RefreshToken? token = null;

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_refresh_token_by_id(@p_id)", connection);
            command.Parameters.AddWithValue("p_id", id);

            await using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                token = new RefreshToken
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    UserId = reader.GetGuid(reader.GetOrdinal("user_id")),
                    Token = reader.GetString(reader.GetOrdinal("token")),
                    CreatedIp = reader.IsDBNull(reader.GetOrdinal("created_ip"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("created_ip")),
                    UserAgent = reader.IsDBNull(reader.GetOrdinal("user_agent"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("user_agent")),
                    ExpiresDate = reader.GetDateTime(reader.GetOrdinal("expires_date")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date"))
                };
            }

            return token;
        }


        public override async Task CreateAsync(RefreshToken entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_create_refresh_token", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_user_id", NpgsqlTypes.NpgsqlDbType.Uuid, entity.UserId);
            command.Parameters.AddWithValue("p_token", NpgsqlTypes.NpgsqlDbType.Text, entity.Token);
            command.Parameters.AddWithValue("p_created_ip", NpgsqlTypes.NpgsqlDbType.Text, (object)entity.CreatedIp ?? DBNull.Value);
            command.Parameters.AddWithValue("p_user_agent", NpgsqlTypes.NpgsqlDbType.Text, (object)entity.UserAgent ?? DBNull.Value);
            command.Parameters.AddWithValue("p_expires_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, entity.ExpiresDate);
            command.Parameters.AddWithValue("p_created_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, entity.CreatedDate);
            command.Parameters.AddWithValue("p_updated_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, (object)entity.UpdatedDate ?? DBNull.Value);

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


        public override async Task UpdateAsync(RefreshToken entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_update_refresh_token", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", NpgsqlTypes.NpgsqlDbType.Uuid, entity.Id);
            command.Parameters.AddWithValue("p_user_id", NpgsqlTypes.NpgsqlDbType.Uuid, entity.UserId);
            command.Parameters.AddWithValue("p_token", NpgsqlTypes.NpgsqlDbType.Text, entity.Token);
            command.Parameters.AddWithValue("p_created_ip", NpgsqlTypes.NpgsqlDbType.Text, (object)entity.CreatedIp ?? DBNull.Value);
            command.Parameters.AddWithValue("p_user_agent", NpgsqlTypes.NpgsqlDbType.Text, (object)entity.UserAgent ?? DBNull.Value);
            command.Parameters.AddWithValue("p_expires_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, entity.ExpiresDate);
            command.Parameters.AddWithValue("p_created_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, entity.CreatedDate);
            command.Parameters.AddWithValue("p_updated_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, (object)entity.UpdatedDate ?? DBNull.Value);

            await command.ExecuteNonQueryAsync();
        }


        public override async Task DeleteAsync(Guid id)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_delete_refresh_token", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", NpgsqlTypes.NpgsqlDbType.Uuid, id);

            await command.ExecuteNonQueryAsync();
        }


        public async Task<RefreshToken?> GetByTokenAsync(string token)
        {
            RefreshToken? result = null;

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_refresh_token_by_token(@p_token)", connection);

            command.Parameters.AddWithValue("p_token", token);

            await using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                result = new RefreshToken
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    UserId = reader.GetGuid(reader.GetOrdinal("user_id")),
                    Token = reader.GetString(reader.GetOrdinal("token")),
                    CreatedIp = reader.IsDBNull(reader.GetOrdinal("created_ip"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("created_ip")),
                    UserAgent = reader.IsDBNull(reader.GetOrdinal("user_agent"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("user_agent")),
                    ExpiresDate = reader.GetDateTime(reader.GetOrdinal("expires_date")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date"))
                };
            }

            return result;
        }
    }
}