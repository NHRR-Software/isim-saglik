using IsimSaglik.Entity.Models;
using IsimSaglik.Repository.Abstract;
using Microsoft.Extensions.Configuration;

namespace IsimSaglik.Repository.Concrete
{
    public class TokenRepository : RepositoryBase<Token>, ITokenRepository
    {
        public TokenRepository(IConfiguration configuration) : base(configuration)
        {
        }


        public override async Task<Token?> GetByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }


        public override async Task<IEnumerable<Token>> GetAllAsync()
        {
            throw new NotImplementedException();
        }


        public override async Task CreateAsync(Token entity)
        {
            throw new NotImplementedException();
        }


        public override async Task UpdateAsync(Token entity)
        {
            throw new NotImplementedException();
        }


        public override Task DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }


        public Task<Token> GetTokenByRefreshTokenAsync(string refreshToken)
        {
            throw new NotImplementedException();
        }
    }
}