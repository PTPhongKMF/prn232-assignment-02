using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FUNMS.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace FUNMS.DAL.Repositories {
    public class NewsRepository : GenericRepository<NewsArticle> {
        public NewsRepository(FunewsManagementContext context) : base(context) {
        }
        
        public IQueryable<NewsArticle> GetAllNewsArticlesAsQueryable(bool isPublic = false) {
            var query = _context.NewsArticles.AsQueryable();
            if (isPublic) {
                query = query.Where(n => n.NewsStatus == true);
            }
            return query
                .Include(n => n.Category)
                .Include(n => n.CreatedBy)
                .Include(n => n.Tags);
        }
        
        public async Task<NewsArticle?> GetNewsArticleById(int id) {
            return await _context.NewsArticles
                .Include(n => n.Category)
                .Include(n => n.CreatedBy)
                .Include(n => n.Tags)
                .FirstOrDefaultAsync(n => n.NewsArticleId == id);
        }
        
        public async Task<NewsArticle> CreateNewsArticle(NewsArticle newsArticle, IEnumerable<int> tagIds) {
            await _context.NewsArticles.AddAsync(newsArticle);
            await _context.SaveChangesAsync();
            
            if (tagIds != null && tagIds.Any()) {
                foreach (var tagId in tagIds) {
                    var tag = await _context.Tags.FindAsync(tagId);
                    if (tag != null) {
                        newsArticle.Tags.Add(tag);
                    }
                }
                await _context.SaveChangesAsync();
            }
            
            return newsArticle;
        }
        
        public async Task<NewsArticle?> UpdateNewsArticle(NewsArticle newsArticle, IEnumerable<int> tagIds) {
            _context.NewsArticles.Update(newsArticle);
            
            var existingArticle = await _context.NewsArticles
                .Include(n => n.Tags)
                .FirstOrDefaultAsync(n => n.NewsArticleId == newsArticle.NewsArticleId);
                
            if (existingArticle == null) {
                return null;
            }
            
            existingArticle.Tags.Clear();
            
            if (tagIds != null && tagIds.Any()) {
                foreach (var tagId in tagIds) {
                    var tag = await _context.Tags.FindAsync(tagId);
                    if (tag != null) {
                        existingArticle.Tags.Add(tag);
                    }
                }
            }
            
            await _context.SaveChangesAsync();
            
            return existingArticle;
        }
        
        public async Task<bool> DeleteNewsArticle(int id) {
            var newsArticle = await _context.NewsArticles
                .Include(n => n.Tags)
                .FirstOrDefaultAsync(n => n.NewsArticleId == id);
                
            if (newsArticle == null) {
                return false;
            }
            
            newsArticle.Tags.Clear();
            
            _context.NewsArticles.Remove(newsArticle);
            await _context.SaveChangesAsync();
            
            return true;
        }

        public IQueryable<NewsArticle> GetNewsStatistics(DateTime? startDate, DateTime? endDate) {
            var query = _context.NewsArticles.AsQueryable();
            
            if (startDate.HasValue) {
                query = query.Where(n => n.CreatedDate >= startDate.Value);
            }
            
            if (endDate.HasValue) {
                var endOfDay = endDate.Value.Date.AddDays(1).AddSeconds(-1);
                query = query.Where(n => n.CreatedDate <= endOfDay);
            }
            
            return query
                .Include(n => n.Category)
                .Include(n => n.CreatedBy)
                .Include(n => n.Tags);
        }
    }
}
