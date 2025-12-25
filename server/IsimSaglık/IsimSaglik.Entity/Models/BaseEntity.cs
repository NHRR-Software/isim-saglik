namespace IsimSaglik.Entity.Models
{
    public abstract class BaseEntity
    {
        public Guid Id { get; set; }
        public required DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}