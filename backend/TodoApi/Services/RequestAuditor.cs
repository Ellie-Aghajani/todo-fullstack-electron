namespace TodoApi.Services;

public class RequestAuditor
{
    private readonly TodoActivityLogger _logger;

    public RequestAuditor(TodoActivityLogger logger)
    {
        _logger = logger;

        // THE LEAK: subscribing here permanently attaches this instance's
        // HandleActivity method to the singleton's event list. RequestAuditor
        // is registered as Scoped (one per HTTP request), but nothing here
        // ever removes this subscription. When the request ends, .NET's DI
        // container is done with this instance and would normally let the
        // garbage collector reclaim it — but it can't, because the singleton
        // (which lives forever) still holds a reference to it through this
        // event subscription. Every request leaves one more RequestAuditor
        // permanently stuck in memory.
        _logger.ActivityRecorded += HandleActivity;
    }

    private void HandleActivity(string message)
    {
        Console.WriteLine($"[Audit] {message}");
    }
}