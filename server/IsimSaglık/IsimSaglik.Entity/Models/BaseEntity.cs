namespace IsimSaglik.Entity.Models
{
    public abstract class BaseEntity
    {
        public required string Id { get; set; }
        public required DateTime CreatedDate { get; set; }
        public required DateTime UpdatedDate { get; set; }
    }
}