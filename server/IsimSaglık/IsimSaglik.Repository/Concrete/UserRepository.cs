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

            await using var command = new NpgsqlCommand("sp_get_all_users", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var user = new User
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    FullName = reader.GetString(reader.GetOrdinal("full_name")),
                    Email = reader.GetString(reader.GetOrdinal("email")),
                    Password = reader.GetString(reader.GetOrdinal("password")),
                    PhoneNumber = reader.GetString(reader.GetOrdinal("phone_number")),
                    Role = (UserRole)reader.GetInt16(reader.GetOrdinal("role")),
                    Gender = (Gender)reader.GetInt16(reader.GetOrdinal("gender")),
                    IsActive = reader.GetBoolean(reader.GetOrdinal("is_active")),
                    CompanyId = reader.IsDBNull(reader.GetOrdinal("parent_company_id"))
                        ? null
                        : reader.GetGuid(reader.GetOrdinal("parent_company_id")),
                    JobTitle = reader.IsDBNull(reader.GetOrdinal("job_title"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("job_title")),
                    BirthDate = reader.GetDateTime(reader.GetOrdinal("birth_date")),
                    Photo = new Uri(reader.GetString(reader.GetOrdinal("photo")))
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

            command.Parameters.AddWithValue("p_full_name", entity.FullName);
            command.Parameters.AddWithValue("p_email", entity.Email);
            command.Parameters.AddWithValue("p_password", entity.Password);
            command.Parameters.AddWithValue("p_phone_number", entity.PhoneNumber);
            command.Parameters.AddWithValue("p_role", (short)entity.Role);
            command.Parameters.AddWithValue("p_gender", (short)entity.Gender);
            command.Parameters.AddWithValue("p_is_active", entity.IsActive);
            command.Parameters.AddWithValue("p_parent_company_id", (object)entity.CompanyId ?? DBNull.Value);
            command.Parameters.AddWithValue("p_job_title", (object)entity.JobTitle ?? DBNull.Value);
            command.Parameters.AddWithValue("p_birth_date", entity.BirthDate);
            command.Parameters.AddWithValue("p_photo", entity.Photo.ToString());

            var newId = await command.ExecuteScalarAsync();
        }


        public override async Task UpdateAsync(User entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_update_user", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", entity.Id);
            command.Parameters.AddWithValue("p_full_name", entity.FullName);
            command.Parameters.AddWithValue("p_email", entity.Email);
            command.Parameters.AddWithValue("p_password", entity.Password);
            command.Parameters.AddWithValue("p_phone_number", entity.PhoneNumber);
            command.Parameters.AddWithValue("p_role", (short)entity.Role);
            command.Parameters.AddWithValue("p_gender", (short)entity.Gender);
            command.Parameters.AddWithValue("p_is_active", entity.IsActive);
            command.Parameters.AddWithValue("p_parent_company_id", (object)entity.CompanyId ?? DBNull.Value);
            command.Parameters.AddWithValue("p_job_title", (object)entity.JobTitle ?? DBNull.Value);
            command.Parameters.AddWithValue("p_birth_date", entity.BirthDate);
            command.Parameters.AddWithValue("p_photo", entity.Photo.ToString());

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

            command.Parameters.AddWithValue("p_id", id);

            await command.ExecuteNonQueryAsync();
        }


        public override async Task<User?> GetByIdAsync(Guid id)
        {
            User? user = null;

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_get_user_by_id", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", id);

            await using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                user = new User
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    FullName = reader.GetString(reader.GetOrdinal("full_name")),
                    Email = reader.GetString(reader.GetOrdinal("email")),
                    Password = reader.GetString(reader.GetOrdinal("password")),
                    PhoneNumber = reader.GetString(reader.GetOrdinal("phone_number")),
                    Role = (UserRole)reader.GetInt16(reader.GetOrdinal("role")),
                    Gender = (Gender)reader.GetInt16(reader.GetOrdinal("gender")),
                    IsActive = reader.GetBoolean(reader.GetOrdinal("is_active")),
                    CompanyId = reader.IsDBNull(reader.GetOrdinal("parent_company_id"))
                        ? null
                        : reader.GetGuid(reader.GetOrdinal("parent_company_id")),
                    JobTitle = reader.IsDBNull(reader.GetOrdinal("job_title"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("job_title")),
                    BirthDate = reader.GetDateTime(reader.GetOrdinal("birth_date")),
                    Photo = new Uri(reader.GetString(reader.GetOrdinal("photo")))
                };
            }

            return user;
        }
    }
}