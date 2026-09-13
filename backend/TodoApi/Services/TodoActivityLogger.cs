namespace TodoApi.Services;

// Registered as a Singleton in Program.cs — one instance for the entire
// lifetime of the app. That's what makes this class dangerous to
// subscribe to carelessly: anything it holds a reference to stays alive
// as long as the app is running, even long after that thing should have
// been garbage collected.
public class TodoActivityLogger
{
    public event Action<string>? ActivityRecorded;

    public void Record(string message)
    {
        ActivityRecorded?.Invoke(message);
    }
}