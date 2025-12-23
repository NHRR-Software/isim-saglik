using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsimSaglik.Repository.Concrete
{
    public class UserRepository : IUserRepository
    {




        public async Task CreateAsync(User user) 
        {
            // Conneciton

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new NpgsqlCommand("sp_create_user", connection)
            {
                CommandType = CommandType.StoredProcedure
            };


        }
    }
}
