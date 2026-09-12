namespace TodoApi.Models;

public class Category : AuditableEntity
{
    public int Id { get; private set; }
    public string Name { get; private set; } = string.Empty;

    // Navigation property: lets EF Core (and our own code) go from a
    // Category to every Todo that belongs to it. Not a real database
    // column — EF Core figures this out from the relationship.
    public ICollection<Todo> Todos { get; private set; } = new List<Todo>();

    private Category() { }

    public static Category Create(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Category name cannot be empty.", nameof(name));

        return new Category { Name = name.Trim() };
    }
}