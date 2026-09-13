namespace TodoApi.Services;

public class RequestAuditor: IDisposable //in C#, just naming a method Dispose() does nothing special by itself — it's the : IDisposable interface declaration that plugs it into the runtime's/DI container's cleanup mechanism.
{
    private readonly TodoActivityLogger _logger;

    public RequestAuditor(TodoActivityLogger logger)
    {
        _logger = logger;
        _logger.ActivityRecorded += HandleActivity;
    }

    private void HandleActivity(string message)
    {
        Console.WriteLine($"[Audit] {message}");
    }
        public void Dispose()
    {
        // The fix: explicitly remove this instance from the singleton's
        // subscriber list. Because RequestAuditor is registered as Scoped
        // and implements IDisposable, .NET's DI container automatically
        // calls Dispose() at the end of every request — but only because
        // we wrote the unsubscribe logic ourselves. Without this line,
        // Dispose() being called wouldn't help at all, since the leak was
        // never about disposal — it was about the event reference itself.
        _logger.ActivityRecorded -= HandleActivity;
    }

}