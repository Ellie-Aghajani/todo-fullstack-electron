namespace TodoApi.Services;

// Abstraction: RequestAuditor (and anything else that wants to log
// activity) depends on this interface, not on TodoActivityLogger
// directly. Swapping in a different logging implementation later —
// writing to a file, a database, a third-party service — only
// requires changing the DI registration in Program.cs, nothing
// about RequestAuditor's own code.
public interface IActivityLogger
{
    event Action<string>? ActivityRecorded;
    void Record(string message);
}

// Registered as a Singleton in Program.cs — one instance for the entire
// lifetime of the app. That's what makes this class dangerous to
// subscribe to carelessly: anything it holds a reference to stays alive
// as long as the app is running, even long after that thing should have
// been garbage collected.
public class TodoActivityLogger: IActivityLogger
{
    public event Action<string>? ActivityRecorded;

    public void Record(string message)
    {
        ActivityRecorded?.Invoke(message);
    }
}