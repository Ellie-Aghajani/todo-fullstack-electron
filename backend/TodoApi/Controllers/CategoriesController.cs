using Microsoft.AspNetCore.Mvc;
using TodoApi.Data;
using TodoApi.Models;
using Microsoft.EntityFrameworkCore;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetAll()
    {
        var categories = await _context.Categories.AsNoTracking().ToListAsync();
        return Ok(categories);
    }

    public record CreateCategoryRequest(string Name);

    [HttpPost]
    public async Task<ActionResult<Category>> Create(CreateCategoryRequest request)
    {
        var category = Category.Create(request.Name);
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = category.Id }, category);
    }
    public record UpdateCategoryRequest(string Name);

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateCategoryRequest request)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound();

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest("Name cannot be empty.");
        }

        category.Rename(request.Name);
        await _context.SaveChangesAsync();
        return Ok(category);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound();

        try
        {
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            // This is the FK edge case from the plan: SQL Server rejected the
            // delete because Todos still reference this Category. We translate
            // that into a clear 409 Conflict instead of a raw 500 error.
            return Conflict("Cannot delete a category that still has todos assigned to it.");
        }

        return NoContent();
    }
}