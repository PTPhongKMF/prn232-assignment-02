using System;
using System.Linq;
using System.Threading.Tasks;
using FUNMS.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace FUNMS.DAL.Repositories {
    public class TagRepository : GenericRepository<Tag> {
        public TagRepository(FunewsManagementContext context) : base(context) {
        }

        public IQueryable<Tag> GetAllTagsAsQueryable() {
            return _context.Tags.AsQueryable();
        }

        public async Task<Tag?> GetTagById(int id) {
            return await _context.Tags
                .Include(t => t.NewsArticles)
                .FirstOrDefaultAsync(t => t.TagId == id);
        }

        public async Task<bool> NameExists(string name, int? excludeId = null) {
            var query = _context.Tags.Where(t => t.TagName == name);
            if (excludeId.HasValue) {
                query = query.Where(t => t.TagId != excludeId.Value);
            }
            return await query.AnyAsync();
        }
    }
}


