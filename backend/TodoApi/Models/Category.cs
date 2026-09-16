namespace TodoApi.Models;

public class Category : AuditableEntity
{
    public int Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string UserId { get; private set; } = string.Empty;
    public ICollection<Todo> Todos { get; private set; } = new List<Todo>();

    private Category() { }

    public static Category Create(string name, string userId)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Category name cannot be empty.", nameof(name));
        if (string.IsNullOrWhiteSpace(userId))
            throw new ArgumentException("UserId is required.", nameof(userId));

        return new Category { Name = name.Trim(), UserId = userId };
    }

    public void Rename(string newName)
    {
        if (string.IsNullOrWhiteSpace(newName))
            throw new ArgumentException("Category name cannot be empty.");
        Name = newName.Trim();
        Touch();
    }
}