using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace IsimSaglik.Repository.Concrete
{
    public class SensorLogRepository : RepositoryBase<SensorLog>, ISensorLogRepository
    {
        public SensorLogRepository(IConfiguration configuration) : base(configuration)
        {
        }


        public override async Task CreateAsync(SensorLog entity)
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_create_sensor_log", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("p_user_id", NpgsqlTypes.NpgsqlDbType.Uuid, entity.UserId);
            command.Parameters.AddWithValue("p_heart_rate", NpgsqlTypes.NpgsqlDbType.Integer, entity.HeartRate ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("p_spo2", NpgsqlTypes.NpgsqlDbType.Integer, entity.SpO2 ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("p_stress_level", NpgsqlTypes.NpgsqlDbType.Integer, entity.StressLevel ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("p_temperature", NpgsqlTypes.NpgsqlDbType.Numeric, entity.Temperature ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("p_humidity", NpgsqlTypes.NpgsqlDbType.Numeric, entity.Humidity ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("p_light_level", NpgsqlTypes.NpgsqlDbType.Integer, entity.LightLevel ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("p_noise_level", NpgsqlTypes.NpgsqlDbType.Numeric, entity.NoiseLevel ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("p_recorded_date", NpgsqlTypes.NpgsqlDbType.TimestampTz, entity.RecordedDate);
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


        public override Task UpdateAsync(SensorLog entity)
        {
            throw new NotImplementedException();
        }


        public override Task DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }


        public override Task<SensorLog?> GetByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }


        public override Task<IEnumerable<SensorLog>> GetAllAsync()
        {
            throw new NotImplementedException();
        }


        public async Task<SensorLog?> GetLatestByUserIdAsync(Guid userId)
        {
            SensorLog? log = null;

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_latest_sensor_log_by_user_id(@p_user_id)", connection);
            command.Parameters.AddWithValue("p_user_id", userId);

            await using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                log = new SensorLog
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    UserId = reader.GetGuid(reader.GetOrdinal("user_id")),
                    HeartRate = reader.IsDBNull(reader.GetOrdinal("heart_rate")) ? null : reader.GetInt32(reader.GetOrdinal("heart_rate")),
                    SpO2 = reader.IsDBNull(reader.GetOrdinal("spo2")) ? null : reader.GetInt32(reader.GetOrdinal("spo2")),
                    StressLevel = reader.IsDBNull(reader.GetOrdinal("stress_level")) ? null : reader.GetInt32(reader.GetOrdinal("stress_level")),
                    Temperature = reader.IsDBNull(reader.GetOrdinal("temperature")) ? null : reader.GetDecimal(reader.GetOrdinal("temperature")),
                    Humidity = reader.IsDBNull(reader.GetOrdinal("humidity")) ? null : reader.GetDecimal(reader.GetOrdinal("humidity")),
                    LightLevel = reader.IsDBNull(reader.GetOrdinal("light_level")) ? null : reader.GetInt32(reader.GetOrdinal("light_level")),
                    NoiseLevel = reader.IsDBNull(reader.GetOrdinal("noise_level")) ? null : reader.GetDecimal(reader.GetOrdinal("noise_level")),
                    RecordedDate = reader.GetDateTime(reader.GetOrdinal("recorded_date")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = null
                };
            }

            return log;
        }


        public async Task<IEnumerable<SensorLog>?> GetHistoryByUserIdAsync(Guid userId, DateTime startTime, DateTime endTime)
        {
            var logs = new List<SensorLog>();

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("SELECT * FROM sp_get_sensor_log_history_by_user_id(@p_user_id, @p_start_time, @p_end_time)", connection);
            command.Parameters.AddWithValue("p_user_id", userId);
            command.Parameters.AddWithValue("p_start_time", NpgsqlTypes.NpgsqlDbType.TimestampTz, startTime);
            command.Parameters.AddWithValue("p_end_time", NpgsqlTypes.NpgsqlDbType.TimestampTz, endTime);

            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                logs.Add(new SensorLog
                {
                    Id = reader.GetGuid(reader.GetOrdinal("id")),
                    UserId = reader.GetGuid(reader.GetOrdinal("user_id")),
                    HeartRate = reader.IsDBNull(reader.GetOrdinal("heart_rate")) ? null : reader.GetInt32(reader.GetOrdinal("heart_rate")),
                    SpO2 = reader.IsDBNull(reader.GetOrdinal("spo2")) ? null : reader.GetInt32(reader.GetOrdinal("spo2")),
                    StressLevel = reader.IsDBNull(reader.GetOrdinal("stress_level")) ? null : reader.GetInt32(reader.GetOrdinal("stress_level")),
                    Temperature = reader.IsDBNull(reader.GetOrdinal("temperature")) ? null : reader.GetDecimal(reader.GetOrdinal("temperature")),
                    Humidity = reader.IsDBNull(reader.GetOrdinal("humidity")) ? null : reader.GetDecimal(reader.GetOrdinal("humidity")),
                    LightLevel = reader.IsDBNull(reader.GetOrdinal("light_level")) ? null : reader.GetInt32(reader.GetOrdinal("light_level")),
                    NoiseLevel = reader.IsDBNull(reader.GetOrdinal("noise_level")) ? null : reader.GetDecimal(reader.GetOrdinal("noise_level")),
                    RecordedDate = reader.GetDateTime(reader.GetOrdinal("recorded_date")),
                    CreatedDate = reader.GetDateTime(reader.GetOrdinal("created_date")),
                    UpdatedDate = null
                });
            }

            return logs.Count > 0 ? logs : null;
        }
    }
}