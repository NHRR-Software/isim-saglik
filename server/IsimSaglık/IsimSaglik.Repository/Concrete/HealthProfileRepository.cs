using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace IsimSaglik.Repository.Concrete
{
    public class HealthProfileRepository : RepositoryBase<HealthProfile>, IHealthProfileRepository
    {
        public HealthProfileRepository(IConfiguration configuration) : base(configuration)
        {
        }



        // REVIEW: Metodun ismi GetByUserIdAsync olarak güncellenebilir. Diğerleri ile tutarlı olması için.
        public async Task<HealthProfile?> GetHealthProfileByUserIdAsync(Guid userId)
        {
            HealthProfile? healthProfile = null;

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_health_profile_by_user_id(@p_user_id)", connection);
            command.Parameters.AddWithValue("p_user_id", userId);

            await using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                healthProfile = new HealthProfile
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    UserId = reader.GetGuid(reader.GetOrdinal("user_id")),
                    BloodGroup = reader.GetString(reader.GetOrdinal("blood_group")),
                    ChronicDisease = reader.IsDBNull(reader.GetOrdinal("chronic_disease"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("chronic_disease")),
                    Height = reader.GetDouble(reader.GetOrdinal("height")),
                    Weight = reader.GetDouble(reader.GetOrdinal("weight"))
                };
            }

            return healthProfile;
        }



        // REVIEW: GetAllAsync metodu kullanılmayacağı için kaldırılabilir.
        public override async Task<IEnumerable<HealthProfile>> GetAllAsync()
        {
            var profiles = new List<HealthProfile>();

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_all_health_profiles()", connection);

            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                profiles.Add(new HealthProfile
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    UserId = reader.GetGuid(reader.GetOrdinal("user_id")),
                    BloodGroup = reader.GetString(reader.GetOrdinal("blood_group")),
                    ChronicDisease = reader.IsDBNull(reader.GetOrdinal("chronic_disease"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("chronic_disease")),
                    Height = reader.GetDouble(reader.GetOrdinal("height")),
                    Weight = reader.GetDouble(reader.GetOrdinal("weight"))
                });
            }

            return profiles;
        }


        public override async Task<HealthProfile?> GetByIdAsync(Guid id)
        {
            HealthProfile? healthProfile = null;

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_health_profile_by_id(@p_id)", connection);
            command.Parameters.AddWithValue("p_id", id);

            await using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                healthProfile = new HealthProfile
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    UserId = reader.GetGuid(reader.GetOrdinal("user_id")),
                    BloodGroup = reader.GetString(reader.GetOrdinal("blood_group")),
                    ChronicDisease = reader.IsDBNull(reader.GetOrdinal("chronic_disease"))
                        ? null
                        : reader.GetString(reader.GetOrdinal("chronic_disease")),
                    Height = reader.GetDouble(reader.GetOrdinal("height")),
                    Weight = reader.GetDouble(reader.GetOrdinal("weight"))
                };
            }

            return healthProfile;
        }


        public override async Task CreateAsync(HealthProfile entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_create_health_profile", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_created_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, entity.CreatedDate);
            command.Parameters.AddWithValue("p_updated_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, (object)entity.UpdatedDate ?? DBNull.Value);
            command.Parameters.AddWithValue("p_user_id", NpgsqlTypes.NpgsqlDbType.Uuid, entity.UserId);
            command.Parameters.AddWithValue("p_blood_group", NpgsqlTypes.NpgsqlDbType.Text, entity.BloodGroup);
            command.Parameters.AddWithValue("p_chronic_disease", NpgsqlTypes.NpgsqlDbType.Text, (object)entity.ChronicDisease ?? DBNull.Value);
            command.Parameters.AddWithValue("p_height", NpgsqlTypes.NpgsqlDbType.Double, entity.Height);
            command.Parameters.AddWithValue("p_weight", NpgsqlTypes.NpgsqlDbType.Double, entity.Weight);

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


        public override async Task UpdateAsync(HealthProfile entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_update_health_profile", connection)
            {
                CommandType = CommandType.StoredProcedure
            };          

            command.Parameters.AddWithValue("p_id", NpgsqlTypes.NpgsqlDbType.Uuid, entity.Id);
            command.Parameters.AddWithValue("p_created_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, entity.CreatedDate);
            command.Parameters.AddWithValue("p_updated_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, (object)entity.UpdatedDate ?? DBNull.Value);
            command.Parameters.AddWithValue("p_user_id", NpgsqlTypes.NpgsqlDbType.Uuid, entity.UserId);
            command.Parameters.AddWithValue("p_blood_group", NpgsqlTypes.NpgsqlDbType.Text, entity.BloodGroup);
            command.Parameters.AddWithValue("p_chronic_disease", NpgsqlTypes.NpgsqlDbType.Text, (object)entity.ChronicDisease ?? DBNull.Value);
            command.Parameters.AddWithValue("p_height", NpgsqlTypes.NpgsqlDbType.Double, entity.Height);
            command.Parameters.AddWithValue("p_weight", NpgsqlTypes.NpgsqlDbType.Double, entity.Weight);

            await command.ExecuteNonQueryAsync();
        }


        public override async Task DeleteAsync(Guid id)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_delete_health_profile", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", NpgsqlTypes.NpgsqlDbType.Uuid, id);

            await command.ExecuteNonQueryAsync();
        }
    }
}