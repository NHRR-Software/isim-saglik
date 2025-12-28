using IsimSaglik.Entity.Enums;
using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace IsimSaglik.Repository.Concrete
{
    public class AssignmentRepository : RepositoryBase<Assignment>, IAssignmentRepository
    {
        public AssignmentRepository(IConfiguration configuration) : base(configuration)
        {
        }


        public async Task<IEnumerable<Assignment>> GetAssignmentsByUserIdAsync(Guid userId)
        {
            var assignments = new List<Assignment>();

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_assignments_by_user_id(@p_user_id)", connection);
            command.Parameters.AddWithValue("p_user_id", userId);

            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                assignments.Add(new Assignment
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    Status = (StatusType)reader.GetInt16(reader.GetOrdinal("status")),
                    Severity = (SeverityType)reader.GetInt16(reader.GetOrdinal("severity")),
                    Description = reader.GetString(reader.GetOrdinal("description")),
                    UserId = reader.GetGuid(reader.GetOrdinal("user_id"))
                });
            }

            return assignments;
        }


        public override async Task<IEnumerable<Assignment>> GetAllAsync()
        {
            var assignments = new List<Assignment>();

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_all_assignments()", connection);

            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                assignments.Add(new Assignment
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    Status = (StatusType)reader.GetInt16(reader.GetOrdinal("status")),
                    Severity = (SeverityType)reader.GetInt16(reader.GetOrdinal("severity")),
                    Description = reader.GetString(reader.GetOrdinal("description")),
                    UserId = reader.GetGuid(reader.GetOrdinal("user_id"))
                });
            }

            return assignments;
        }


        public override async Task<Assignment?> GetByIdAsync(Guid id)
        {
            Assignment? assignment = null;

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_assignment_by_id(@p_id)", connection);
            command.Parameters.AddWithValue("p_id", id);

            await using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                assignment = new Assignment
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    Status = (StatusType)reader.GetInt16(reader.GetOrdinal("status")),
                    Severity = (SeverityType)reader.GetInt16(reader.GetOrdinal("severity")),
                    Description = reader.GetString(reader.GetOrdinal("description")),
                    UserId = reader.GetGuid(reader.GetOrdinal("user_id"))
                };
            }

            return assignment;
        }


        public override async Task CreateAsync(Assignment entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_create_assignment", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_created_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, entity.CreatedDate);
            command.Parameters.AddWithValue("p_updated_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, (object)entity.UpdatedDate ?? DBNull.Value);
            command.Parameters.AddWithValue("p_status", NpgsqlTypes.NpgsqlDbType.Smallint, (short)entity.Status);
            command.Parameters.AddWithValue("p_severity", NpgsqlTypes.NpgsqlDbType.Smallint, (short)entity.Severity);
            command.Parameters.AddWithValue("p_description", NpgsqlTypes.NpgsqlDbType.Text, entity.Description);
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


        public override async Task UpdateAsync(Assignment entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_update_assignment", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", NpgsqlTypes.NpgsqlDbType.Uuid, entity.Id);
            command.Parameters.AddWithValue("p_created_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, entity.CreatedDate);
            command.Parameters.AddWithValue("p_updated_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, (object)entity.UpdatedDate ?? DBNull.Value);
            command.Parameters.AddWithValue("p_status", NpgsqlTypes.NpgsqlDbType.Smallint, (short)entity.Status);
            command.Parameters.AddWithValue("p_severity", NpgsqlTypes.NpgsqlDbType.Smallint, (short)entity.Severity);
            command.Parameters.AddWithValue("p_description", NpgsqlTypes.NpgsqlDbType.Text, entity.Description);
            command.Parameters.AddWithValue("p_user_id", NpgsqlTypes.NpgsqlDbType.Uuid, entity.UserId);

            await command.ExecuteNonQueryAsync();
        }


        public override async Task DeleteAsync(Guid id)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_delete_assignment", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", NpgsqlTypes.NpgsqlDbType.Uuid, id);

            await command.ExecuteNonQueryAsync();
        }
    }
}