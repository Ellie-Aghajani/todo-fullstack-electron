namespace TodoApi.Models;
public class Todo : AuditableEntity
{
    public int Id { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public bool IsComplete { get; private set; }
    public int CategoryId { get; private set; }
    public Category? Category { get; private set; }

    // Firebase UIDs are strings (typically 28 characters), not integers —
    // this identifies which authenticated user owns this todo.
    public string UserId { get; private set; } = string.Empty;

    private Todo() { }

    public static Todo Create(string title, int categoryId, string userId)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title cannot be empty.", nameof(title));
        if (string.IsNullOrWhiteSpace(userId))
            throw new ArgumentException("UserId is required.", nameof(userId));

        return new Todo
        {
            Title = title.Trim(),
            CategoryId = categoryId,
            UserId = userId,
            IsComplete = false
        };
    }

    public void MarkComplete()
    {
        IsComplete = true;
        Touch();
    }

    public void MarkIncomplete()
    {
        IsComplete = false;
        Touch();
    }

    public void Rename(string newTitle)
    {
        if (string.IsNullOrWhiteSpace(newTitle))
            throw new ArgumentException("Title cannot be empty.", nameof(newTitle));
        Title = newTitle.Trim();
        Touch();
    }
}