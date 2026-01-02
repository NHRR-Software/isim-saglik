using IsimSaglik.Entity.Enums;
using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace IsimSaglik.Repository.Concrete
{
    public class UserInvitationRepository : RepositoryBase<UserInvitation>, IUserInvitationRepository
    {
        public UserInvitationRepository(IConfiguration configuration) : base(configuration)
        {
        }


        public override async Task<IEnumerable<UserInvitation>> GetAllAsync()
        {
            throw new NotImplementedException();
        }



        public override async Task<UserInvitation?> GetByIdAsync(Guid id)
        {
            UserInvitation? invitation = null;

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_user_invitation_by_id(@p_id)", connection);
            command.Parameters.AddWithValue("p_id", id);

            await using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                invitation = new UserInvitation
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    Email = reader.GetString(reader.GetOrdinal("email")),
                    Role = (UserRole)reader.GetInt16(reader.GetOrdinal("role")),
                    CompanyId = reader.GetGuid(reader.GetOrdinal("company_id")),
                    ExpiresDate = reader.GetDateTime(reader.GetOrdinal("expires_date")),
                    IsUsed = reader.GetBoolean(reader.GetOrdinal("is_used")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date"))
                };
            }

            return invitation;
        }



        public async Task<UserInvitation?> GetByEmailAsync(string email)
        {
            UserInvitation? invitation = null;

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_invitation_by_email(@p_email)", connection);
            command.Parameters.AddWithValue("p_email", email);

            await using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                invitation = new UserInvitation
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    Email = reader.GetString(reader.GetOrdinal("email")),
                    Role = (UserRole)reader.GetInt16(reader.GetOrdinal("role")),
                    CompanyId = reader.GetGuid(reader.GetOrdinal("company_id")),
                    ExpiresDate = reader.GetDateTime(reader.GetOrdinal("expires_date")),
                    IsUsed = reader.GetBoolean(reader.GetOrdinal("is_used")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date"))
                };
            }

            return invitation;
        }



        public async Task<IEnumerable<UserInvitation>?> GetByCompanyIdAsync(Guid companyId)
        {
            var list = new List<UserInvitation>();

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_user_invitations_by_company(@p_company_id)", connection);
            command.Parameters.AddWithValue("p_company_id", companyId);

            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new UserInvitation
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    Email = reader.GetString(reader.GetOrdinal("email")),
                    Role = (UserRole)reader.GetInt16(reader.GetOrdinal("role")),
                    CompanyId = reader.GetGuid(reader.GetOrdinal("company_id")),
                    ExpiresDate = reader.GetDateTime(reader.GetOrdinal("expires_date")),
                    IsUsed = reader.GetBoolean(reader.GetOrdinal("is_used")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date"))
                });
            }

            return list.Count > 0 ? list : null;
        }



        public override async Task CreateAsync(UserInvitation entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_create_user_invitation", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_email", NpgsqlTypes.NpgsqlDbType.Text, entity.Email);
            command.Parameters.AddWithValue("p_role", NpgsqlTypes.NpgsqlDbType.Smallint, (short)entity.Role);
            command.Parameters.AddWithValue("p_company_id", NpgsqlTypes.NpgsqlDbType.Uuid, entity.CompanyId);
            command.Parameters.AddWithValue("p_expires_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, entity.ExpiresDate);
            command.Parameters.AddWithValue("p_is_used", NpgsqlTypes.NpgsqlDbType.Boolean, entity.IsUsed);
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



        public override async Task UpdateAsync(UserInvitation entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_update_user_invitation", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", NpgsqlTypes.NpgsqlDbType.Uuid, entity.Id);
            command.Parameters.AddWithValue("p_email", NpgsqlTypes.NpgsqlDbType.Text, entity.Email);
            command.Parameters.AddWithValue("p_role", NpgsqlTypes.NpgsqlDbType.Smallint, (short)entity.Role);
            command.Parameters.AddWithValue("p_company_id", NpgsqlTypes.NpgsqlDbType.Uuid, entity.CompanyId);
            command.Parameters.AddWithValue("p_expires_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, entity.ExpiresDate);
            command.Parameters.AddWithValue("p_is_used", NpgsqlTypes.NpgsqlDbType.Boolean, entity.IsUsed);
            command.Parameters.AddWithValue("p_created_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, entity.CreatedDate);
            command.Parameters.AddWithValue("p_updated_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, (object)entity.UpdatedDate ?? DBNull.Value);

            await command.ExecuteNonQueryAsync();
        }



        public override async Task DeleteAsync(Guid id)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_delete_user_invitation", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", NpgsqlTypes.NpgsqlDbType.Uuid, id);

            await command.ExecuteNonQueryAsync();
        }
    }
}