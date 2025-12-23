using IsimSaglik.Repository.Abstract;

namespace IsimSaglik.Repository.Concrete
{
    public abstract class RepositoryBase<T> : IRepositoryBase<T> where T : class
    {

        public abstract Task<IEnumerable<T>> GetAllAsync();

        public abstract Task<T?> GetByIdAsync(Guid id);

        public abstract Task CreateAsync(T entity);

        public abstract Task UpdateAsync(T entity);

        public abstract Task DeleteAsync(Guid id);
       
    }
}
