using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace IsimSaglik.Repository.Concrete
{
    public class TokenRepository : RepositoryBase<Token>, ITokenRepository
    {
        public TokenRepository(IConfiguration configuration) : base(configuration)
        {
        }


        public override async Task<Token?> GetByIdAsync(Guid id)
        {
            Token? token = null;

            await using var connection = new Npgsql.NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new Npgsql.NpgsqlCommand("sp_get_token_by_id", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", id);

            await using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                token = new Token
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    RefreshToken = reader.GetString(reader.GetOrdinal("refresh_token")),
                    UserId = reader.GetGuid(reader.GetOrdinal("user_id")),
                    CreatedIp = reader.IsDBNull(reader.GetOrdinal("created_ip"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("created_ip")),
                    UserAgent = reader.IsDBNull(reader.GetOrdinal("user_agent"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("user_agent")),
                    ExpiresDate = reader.GetDateTime(reader.GetOrdinal("expires_date"))
                };
            }

            return token;
        }


        public override async Task<IEnumerable<Token>> GetAllAsync()
        {
            var tokens = new List<Token>();

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_get_all_tokens", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                tokens.Add(new Token
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    RefreshToken = reader.GetString(reader.GetOrdinal("refresh_token")),
                    UserId = reader.GetGuid(reader.GetOrdinal("user_id")),
                    CreatedIp = reader.IsDBNull(reader.GetOrdinal("created_ip"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("created_ip")),
                    UserAgent = reader.IsDBNull(reader.GetOrdinal("user_agent"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("user_agent")),
                    ExpiresDate = reader.GetDateTime(reader.GetOrdinal("expires_date"))
                });
            }
            return tokens;
        }


        public override async Task CreateAsync(Token entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_create_token", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_created_date", entity.CreatedDate);
            command.Parameters.AddWithValue("p_updated_date", entity.UpdatedDate);
            command.Parameters.AddWithValue("p_refresh_token", entity.RefreshToken);
            command.Parameters.AddWithValue("p_user_id", entity.UserId);
            command.Parameters.AddWithValue("p_created_ip", (object)entity.CreatedIp ?? DBNull.Value);
            command.Parameters.AddWithValue("p_user_agent", (object)entity.UserAgent ?? DBNull.Value);
            command.Parameters.AddWithValue("p_expires_date", entity.ExpiresDate);

            await command.ExecuteScalarAsync();
        }


        public override async Task UpdateAsync(Token entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_update_token", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", entity.Id);
            command.Parameters.AddWithValue("p_created_date", entity.CreatedDate);
            command.Parameters.AddWithValue("p_updated_date", entity.UpdatedDate);
            command.Parameters.AddWithValue("p_refresh_token", entity.RefreshToken);
            command.Parameters.AddWithValue("p_user_id", entity.UserId);
            command.Parameters.AddWithValue("p_created_ip", (object)entity.CreatedIp ?? DBNull.Value);
            command.Parameters.AddWithValue("p_user_agent", (object)entity.UserAgent ?? DBNull.Value);
            command.Parameters.AddWithValue("p_expires_date", entity.ExpiresDate);

            await command.ExecuteNonQueryAsync();
        }


        public override async Task DeleteAsync(Guid id)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_delete_token", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", id);

            await command.ExecuteNonQueryAsync();
        }


        public Task<Token> GetTokenByRefreshTokenAsync(string refreshToken)
        {
            throw new NotImplementedException();
        }
    }
}