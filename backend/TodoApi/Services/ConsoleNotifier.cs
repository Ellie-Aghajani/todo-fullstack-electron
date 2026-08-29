namespace TodoApi.Services;

public class ConsoleNotifier : INotifier
{
    public void Notify(string message)
    {
        Console.WriteLine($"[Todo] {message}");
    }
}