using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;
using TodoApi.Repositories;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly ITodoRepository _repository;

    public TodosController(ITodoRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Todo>>> GetAll()
    {
        var todos = await _repository.GetAllAsync();
        return Ok(todos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Todo>> GetById(int id)
    {
        var todo = await _repository.GetByIdAsync(id);
        if (todo == null) return NotFound();
        return Ok(todo);
    }

    public record CreateTodoRequest(string Title, int CategoryId);

    [HttpPost]
    public async Task<ActionResult<Todo>> Create(CreateTodoRequest request)
    {
        var todo = Todo.Create(request.Title, request.CategoryId);
        try
        {
            await _repository.AddAsync(todo);
            await _repository.SaveChangesAsync();
            
        }
        catch(DbUpdateException)
        {
            // This is the FK edge case from the plan: SQL Server rejected the
            // insert because the CategoryId doesn't exist. We translate that
            // into a clear 400 Bad Request instead of a raw 500 error.
            return BadRequest($"Category with ID {request.CategoryId} does not exist.");
        }
        return CreatedAtAction(nameof(GetById), new { id = todo.Id }, todo);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _repository.DeleteAsync(id);
        await _repository.SaveChangesAsync();
        return NoContent();
    }
}