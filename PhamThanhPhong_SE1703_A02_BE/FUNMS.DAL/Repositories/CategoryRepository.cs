using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FUNMS.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace FUNMS.DAL.Repositories {
    public class CategoryRepository : GenericRepository<Category> {
        public CategoryRepository(FunewsManagementContext context) : base(context) {
        }

        public IQueryable<Category> GetAllCategoriesAsQueryable() {
            return _context.Categories
                .Include(c => c.NewsArticles);
        }

        public async Task<Category?> GetCategoryById(short id) {
            return await _context.Categories
                .Include(c => c.NewsArticles)
                .FirstOrDefaultAsync(c => c.CategoryId == id);
        }

        public async Task<bool> CanDeleteCategory(short id) {
            var category = await _context.Categories
                .Include(c => c.NewsArticles)
                .FirstOrDefaultAsync(c => c.CategoryId == id);
                
            return category != null && !category.NewsArticles.Any();
        }

        public async Task<bool> NameExists(string name, short? excludeId = null) {
            var query = _context.Categories.Where(c => c.CategoryName == name);
            
            if (excludeId.HasValue) {
                query = query.Where(c => c.CategoryId != excludeId.Value);
            }
            
            return await query.AnyAsync();
        }
    }
}
