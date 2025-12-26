using IsimSaglik.Entity.Enums;
using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace IsimSaglik.Repository.Concrete
{
    public class SafetyFindingRepository : RepositoryBase<SafetyFinding>, ISafetyFindingRepository
    {
        public SafetyFindingRepository(IConfiguration configuration) : base(configuration)
        {
        }


        public override async Task<IEnumerable<SafetyFinding>> GetAllAsync()
        {
            var safetyFindings = new List<SafetyFinding>();

            await using var connection = new Npgsql.NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new Npgsql.NpgsqlCommand("sp_get_all_safety_findings", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                safetyFindings.Add(new SafetyFinding
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    Title = reader.GetString(reader.GetOrdinal("title")),
                    Status = (FindingStatus)reader.GetInt16(reader.GetOrdinal("status")),
                    Severity = (FindingSeverity)reader.GetInt16(reader.GetOrdinal("severity")),
                    Type = (FindingType)reader.GetInt16(reader.GetOrdinal("type")),
                    Description = reader.GetString(reader.GetOrdinal("description")),
                    ClosedDate = reader.GetDateTime(reader.GetOrdinal("closed_date")),
                    PhotoUrl = reader.IsDBNull(reader.GetOrdinal("photo_url"))
                        ? null
                        : new Uri(reader.GetString(reader.GetOrdinal("photo_url"))),
                    CompanyId = reader.GetGuid(reader.GetOrdinal("company_id")),
                    ReporterId = reader.GetGuid(reader.GetOrdinal("reporter_id")),
                    ReportedId = reader.IsDBNull(reader.GetOrdinal("reported_id"))
                        ? null
                        : reader.GetGuid(reader.GetOrdinal("reported_id"))
                });
            }

            return safetyFindings;
        }


        public override async Task<SafetyFinding?> GetByIdAsync(Guid id)
        {
            SafetyFinding? finding = null;

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_get_safety_finding_by_id", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", id);

            await using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                finding = new SafetyFinding
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    Title = reader.GetString(reader.GetOrdinal("title")),
                    Status = (FindingStatus)reader.GetInt16(reader.GetOrdinal("status")),
                    Severity = (FindingSeverity)reader.GetInt16(reader.GetOrdinal("severity")),
                    Type = (FindingType)reader.GetInt16(reader.GetOrdinal("type")),
                    Description = reader.GetString(reader.GetOrdinal("description")),
                    ClosedDate = reader.GetDateTime(reader.GetOrdinal("closed_date")),
                    PhotoUrl = reader.IsDBNull(reader.GetOrdinal("photo_url"))
                        ? null
                        : new Uri(reader.GetString(reader.GetOrdinal("photo_url"))),
                    CompanyId = reader.GetGuid(reader.GetOrdinal("company_id")),
                    ReporterId = reader.GetGuid(reader.GetOrdinal("reporter_id")),
                    ReportedId = reader.IsDBNull(reader.GetOrdinal("reported_id"))
                        ? null
                        : reader.GetGuid(reader.GetOrdinal("reported_id"))
                };
            }

            return finding;
        }


        public async Task<IEnumerable<SafetyFinding>> GetByCompanyIdAsync(Guid companyId)
        {
            var findings = new List<SafetyFinding>();

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_get_safety_findings_by_company_id", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_company_id", companyId);

            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                findings.Add(new SafetyFinding
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    Title = reader.GetString(reader.GetOrdinal("title")),
                    Status = (FindingStatus)reader.GetInt16(reader.GetOrdinal("status")),
                    Severity = (FindingSeverity)reader.GetInt16(reader.GetOrdinal("severity")),
                    Type = (FindingType)reader.GetInt16(reader.GetOrdinal("type")),
                    Description = reader.GetString(reader.GetOrdinal("description")),
                    ClosedDate = reader.GetDateTime(reader.GetOrdinal("closed_date")),
                    PhotoUrl = reader.IsDBNull(reader.GetOrdinal("photo_url"))
                        ? null
                        : new Uri(reader.GetString(reader.GetOrdinal("photo_url"))),
                    CompanyId = reader.GetGuid(reader.GetOrdinal("company_id")),
                    ReporterId = reader.GetGuid(reader.GetOrdinal("reporter_id")),
                    ReportedId = reader.IsDBNull(reader.GetOrdinal("reported_id"))
                        ? null
                        : reader.GetGuid(reader.GetOrdinal("reported_id"))
                });
            }

            return findings;
        }


        public async Task<IEnumerable<SafetyFinding>> GetByReporterIdAsync(Guid reporterId)
        {
            var findings = new List<SafetyFinding>();

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_get_safety_findings_by_reporter_id", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_reporter_id", reporterId);

            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                findings.Add(new SafetyFinding
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = reader.IsDBNull(reader.GetOrdinal("updated_date"))
                        ? null
                        : reader.GetDateTime(reader.GetOrdinal("updated_date")),
                    Title = reader.GetString(reader.GetOrdinal("title")),
                    Status = (FindingStatus)reader.GetInt16(reader.GetOrdinal("status")),
                    Severity = (FindingSeverity)reader.GetInt16(reader.GetOrdinal("severity")),
                    Type = (FindingType)reader.GetInt16(reader.GetOrdinal("type")),
                    Description = reader.GetString(reader.GetOrdinal("description")),
                    ClosedDate = reader.GetDateTime(reader.GetOrdinal("closed_date")),
                    PhotoUrl = reader.IsDBNull(reader.GetOrdinal("photo_url"))
                        ? null
                        : new Uri(reader.GetString(reader.GetOrdinal("photo_url"))),
                    CompanyId = reader.GetGuid(reader.GetOrdinal("company_id")),
                    ReporterId = reader.GetGuid(reader.GetOrdinal("reporter_id")),
                    ReportedId = reader.IsDBNull(reader.GetOrdinal("reported_id"))
                        ? null
                        : reader.GetGuid(reader.GetOrdinal("reported_id"))
                });
            }

            return findings;
        }


        public override async Task CreateAsync(SafetyFinding entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_create_safety_finding", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_created_date", entity.CreatedDate);
            command.Parameters.AddWithValue("p_updated_date", (object)entity.UpdatedDate ?? DBNull.Value);
            command.Parameters.AddWithValue("p_title", entity.Title);
            command.Parameters.AddWithValue("p_status", (short)entity.Status);
            command.Parameters.AddWithValue("p_severity", (short)entity.Severity);
            command.Parameters.AddWithValue("p_type", (short)entity.Type);
            command.Parameters.AddWithValue("p_description", entity.Description);
            command.Parameters.AddWithValue("p_closed_date", entity.ClosedDate);
            command.Parameters.AddWithValue("p_photo_url", (object)entity.PhotoUrl?.ToString() ?? DBNull.Value);
            command.Parameters.AddWithValue("p_company_id", entity.CompanyId);
            command.Parameters.AddWithValue("p_reporter_id", entity.ReporterId);
            command.Parameters.AddWithValue("p_reported_id", (object)entity.ReportedId ?? DBNull.Value);

            await command.ExecuteScalarAsync();
        }


        public override async Task UpdateAsync(SafetyFinding entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_update_safety_finding", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", entity.Id);
            command.Parameters.AddWithValue("p_created_date", entity.CreatedDate);
            command.Parameters.AddWithValue("p_updated_date", (object)entity.UpdatedDate ?? DBNull.Value);
            command.Parameters.AddWithValue("p_title", entity.Title);
            command.Parameters.AddWithValue("p_status", (short)entity.Status);
            command.Parameters.AddWithValue("p_severity", (short)entity.Severity);
            command.Parameters.AddWithValue("p_type", (short)entity.Type);
            command.Parameters.AddWithValue("p_description", entity.Description);
            command.Parameters.AddWithValue("p_closed_date", entity.ClosedDate);
            command.Parameters.AddWithValue("p_photo_url", (object)entity.PhotoUrl?.ToString() ?? DBNull.Value);
            command.Parameters.AddWithValue("p_company_id", entity.CompanyId);
            command.Parameters.AddWithValue("p_reporter_id", entity.ReporterId);
            command.Parameters.AddWithValue("p_reported_id", (object)entity.ReportedId ?? DBNull.Value);

            await command.ExecuteNonQueryAsync();
        }


        public override async Task DeleteAsync(Guid id)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_delete_safety_finding", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_id", id);

            await command.ExecuteNonQueryAsync();
        }
    }
}