using IsimSaglik.Entity.Enums;
using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace IsimSaglik.Repository.Concrete
{
    public class UserRepository : RepositoryBase<User>, IUserRepository
    {
        public UserRepository(IConfiguration configuration) : base(configuration)
        {
        }


        public override async Task<IEnumerable<User>> GetAllAsync()
        {
            var users = new List<User>();

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_all_users()", connection);
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var user = new User
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    FullName = reader.GetString(reader.GetOrdinal("full_name")),
                    Email = reader.GetString(reader.GetOrdinal("email")),
                    PhoneNumber = reader.GetString(reader.GetOrdinal("phone_number")),
                    Role = (UserRole)reader.GetInt16(reader.GetOrdinal("role")),
                    Gender = (Gender)reader.GetInt16(reader.GetOrdinal("gender")),
                    IsActive = reader.GetBoolean(reader.GetOrdinal("is_active")),
                    CompanyId = reader.IsDBNull(reader.GetOrdinal("company_id"))
                        ? null
                        : reader.GetGuid(reader.GetOrdinal("company_id")),
                    JobTitle = reader.IsDBNull(reader.GetOrdinal("job_title"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("job_title")),
                    BirthDate = reader.GetDateTime(reader.GetOrdinal("birth_date")),
                    PhotoUrl = new Uri(reader.GetString(reader.GetOrdinal("photo_url")))
                };

                users.Add(user);
            }

            return users;
        }


        public override async Task CreateAsync(User entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_create_user", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_created_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, entity.CreatedDate);
            command.Parameters.AddWithValue("p_updated_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, entity.UpdatedDate ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("p_full_name", NpgsqlTypes.NpgsqlDbType.Text, entity.FullName);
            command.Parameters.AddWithValue("p_email", NpgsqlTypes.NpgsqlDbType.Text, entity.Email);
            command.Parameters.AddWithValue("p_phone_number", NpgsqlTypes.NpgsqlDbType.Text, entity.PhoneNumber);
            command.Parameters.AddWithValue("p_role", NpgsqlTypes.NpgsqlDbType.Smallint, (short)entity.Role);
            command.Parameters.AddWithValue("p_gender", NpgsqlTypes.NpgsqlDbType.Smallint, (short)entity.Gender);
            command.Parameters.AddWithValue("p_is_active", NpgsqlTypes.NpgsqlDbType.Boolean, entity.IsActive);
            command.Parameters.AddWithValue("p_company_id", NpgsqlTypes.NpgsqlDbType.Uuid, entity.CompanyId ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("p_job_title", NpgsqlTypes.NpgsqlDbType.Text, entity.JobTitle ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("p_birth_date", NpgsqlTypes.NpgsqlDbType.Date, entity.BirthDate);
            command.Parameters.AddWithValue("p_photo_url", NpgsqlTypes.NpgsqlDbType.Text, entity.PhotoUrl.ToString());

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


        public override async Task UpdateAsync(User entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_update_user", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", NpgsqlTypes.NpgsqlDbType.Uuid, entity.Id);
            command.Parameters.AddWithValue("p_created_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, entity.CreatedDate);
            command.Parameters.AddWithValue("p_updated_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, entity.UpdatedDate ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("p_full_name", NpgsqlTypes.NpgsqlDbType.Text, entity.FullName);
            command.Parameters.AddWithValue("p_email", NpgsqlTypes.NpgsqlDbType.Text, entity.Email);
            command.Parameters.AddWithValue("p_phone_number", NpgsqlTypes.NpgsqlDbType.Text, entity.PhoneNumber);
            command.Parameters.AddWithValue("p_role", NpgsqlTypes.NpgsqlDbType.Smallint, (short)entity.Role);
            command.Parameters.AddWithValue("p_gender", NpgsqlTypes.NpgsqlDbType.Smallint, (short)entity.Gender);
            command.Parameters.AddWithValue("p_is_active", NpgsqlTypes.NpgsqlDbType.Boolean, entity.IsActive);
            command.Parameters.AddWithValue("p_company_id", NpgsqlTypes.NpgsqlDbType.Uuid, entity.CompanyId ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("p_job_title", NpgsqlTypes.NpgsqlDbType.Text, entity.JobTitle ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("p_birth_date", NpgsqlTypes.NpgsqlDbType.Date, entity.BirthDate);
            command.Parameters.AddWithValue("p_photo_url", NpgsqlTypes.NpgsqlDbType.Text, entity.PhotoUrl.ToString());

            await command.ExecuteNonQueryAsync();
        }


        public override async Task DeleteAsync(Guid id)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_delete_user", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", NpgsqlTypes.NpgsqlDbType.Uuid, id);

            await command.ExecuteNonQueryAsync();
        }


        public override async Task<User?> GetByIdAsync(Guid id)
        {
            User? user = null;

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_user_by_id(@p_id)", connection);
            command.Parameters.AddWithValue("p_id", id);

            await using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                user = new User
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    FullName = reader.GetString(reader.GetOrdinal("full_name")),
                    Email = reader.GetString(reader.GetOrdinal("email")),
                    PhoneNumber = reader.GetString(reader.GetOrdinal("phone_number")),
                    Role = (UserRole)reader.GetInt16(reader.GetOrdinal("role")),
                    Gender = (Gender)reader.GetInt16(reader.GetOrdinal("gender")),
                    IsActive = reader.GetBoolean(reader.GetOrdinal("is_active")),
                    CompanyId = reader.IsDBNull(reader.GetOrdinal("company_id"))
                        ? null
                        : reader.GetGuid(reader.GetOrdinal("company_id")),
                    JobTitle = reader.IsDBNull(reader.GetOrdinal("job_title"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("job_title")),
                    BirthDate = reader.GetDateTime(reader.GetOrdinal("birth_date")),
                    PhotoUrl = new Uri(reader.GetString(reader.GetOrdinal("photo_url")))
                };
            }

            return user;
        }


        public async Task<User?> GetByEmailAsync(string email)
        {
            User? user = null;

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_user_by_email(@p_email)", connection);
            command.Parameters.AddWithValue("p_email", email);

            await using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                user = new User
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    FullName = reader.GetString(reader.GetOrdinal("full_name")),
                    Email = reader.GetString(reader.GetOrdinal("email")),
                    PhoneNumber = reader.GetString(reader.GetOrdinal("phone_number")),
                    Role = (UserRole)reader.GetInt16(reader.GetOrdinal("role")),
                    Gender = (Gender)reader.GetInt16(reader.GetOrdinal("gender")),
                    IsActive = reader.GetBoolean(reader.GetOrdinal("is_active")),
                    CompanyId = reader.IsDBNull(reader.GetOrdinal("company_id"))
                        ? null
                        : reader.GetGuid(reader.GetOrdinal("company_id")),
                    JobTitle = reader.IsDBNull(reader.GetOrdinal("job_title"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("job_title")),
                    BirthDate = reader.GetDateTime(reader.GetOrdinal("birth_date")),
                    PhotoUrl = new Uri(reader.GetString(reader.GetOrdinal("photo_url")))
                };
            }

            return user;
        }


        public async Task<IEnumerable<User>?> GetByCompanyIdAsync(Guid companyId)
        {
            var users = new List<User>();

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_users_by_company_id(@p_company_id)", connection);
            command.Parameters.AddWithValue("p_company_id", companyId);

            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var user = new User
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    FullName = reader.GetString(reader.GetOrdinal("full_name")),
                    Email = reader.GetString(reader.GetOrdinal("email")),
                    PhoneNumber = reader.GetString(reader.GetOrdinal("phone_number")),
                    Role = (UserRole)reader.GetInt16(reader.GetOrdinal("role")),
                    Gender = (Gender)reader.GetInt16(reader.GetOrdinal("gender")),
                    IsActive = reader.GetBoolean(reader.GetOrdinal("is_active")),
                    CompanyId = reader.IsDBNull(reader.GetOrdinal("company_id"))
                        ? null
                        : reader.GetGuid(reader.GetOrdinal("company_id")),
                    JobTitle = reader.IsDBNull(reader.GetOrdinal("job_title"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("job_title")),
                    BirthDate = reader.GetDateTime(reader.GetOrdinal("birth_date")),
                    PhotoUrl = new Uri(reader.GetString(reader.GetOrdinal("photo_url")))
                };

                users.Add(user);
            }

            return users.Count > 0 ? users : null;
        }
    }
}