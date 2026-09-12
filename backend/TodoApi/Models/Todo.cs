namespace TodoApi.Models;

public class Todo : AuditableEntity //extend Todo class to inherit from AuditableEntity
{
    public int Id { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public bool IsComplete { get; private set; }

    // Foreign key: this column will store the Id of the Category this
    // todo belongs to. This is the actual FK column in the database.
    public int CategoryId { get; private set; }

    // Navigation property: lets our code go from a Todo to its full
    // Category object (name, etc.), not just the raw CategoryId number.
    public Category? Category { get; private set; }

    // Private constructor: nobody outside this class can do `new Todo()`.
    // The only way to create one is through Create() below, which validates first.
    private Todo() { }

    public static Todo Create(string title, int categoryId)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title cannot be empty.", nameof(title));

        return new Todo { Title = title.Trim(), CategoryId = categoryId, IsComplete = false };
    }

    public void MarkComplete()
    {
        IsComplete = true;
        Touch(); //inherited method from AuditableEntity to update UpdatedAt timestamp
    }

    public void Rename(string newTitle)
    {
        if (string.IsNullOrWhiteSpace(newTitle))
            throw new ArgumentException("Title cannot be empty.", nameof(newTitle));

        Title = newTitle.Trim();
        Touch(); // Update the UpdatedAt timestamp, use Inherited method from AuditableEntity
    }
}