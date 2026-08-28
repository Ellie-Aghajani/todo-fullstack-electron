namespace TodoApi.Models;

public abstract class AuditableEntity
{
    public DateTime CreatedAt { get; protected set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; protected set; }

    public void Touch()
    {
        UpdatedAt = DateTime.UtcNow;
    }
}