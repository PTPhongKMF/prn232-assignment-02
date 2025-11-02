using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace FUNMS.DAL.Repositories {
    public class GenericRepository<T> where T : class {
        protected readonly FunewsManagementContext _context;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(FunewsManagementContext context) {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public virtual async Task<T?> GetByIdAsync(int id) {
            return await _dbSet.FindAsync(id);
        }

        public virtual async Task<T?> GetByIdAsync<TKey>(TKey id) {
            return await _dbSet.FindAsync(id);
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync() {
            return await _dbSet.ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync(int pageNumber, int pageSize) {
            return await _dbSet
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        // Get entities with condition
        public virtual async Task<IEnumerable<T>> GetAsync(Expression<Func<T, bool>> predicate) {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        // Get single entity with condition
        public virtual async Task<T?> GetFirstOrDefaultAsync(Expression<Func<T, bool>> predicate) {
            return await _dbSet.FirstOrDefaultAsync(predicate);
        }

        // Get count of entities
        public virtual async Task<int> CountAsync() {
            return await _dbSet.CountAsync();
        }

        // Get count with condition
        public virtual async Task<int> CountAsync(Expression<Func<T, bool>> predicate) {
            return await _dbSet.CountAsync(predicate);
        }

        // Check if entity exists
        public virtual async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate) {
            return await _dbSet.AnyAsync(predicate);
        }

        // Add single entity
        public virtual async Task<T> AddAsync(T entity) {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        // Add multiple entities
        public virtual async Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities) {
            await _dbSet.AddRangeAsync(entities);
            await _context.SaveChangesAsync();
            return entities;
        }

        // Update entity
        public virtual async Task<T> UpdateAsync(T entity) {
            _dbSet.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        // Update multiple entities
        public virtual async Task<IEnumerable<T>> UpdateRangeAsync(IEnumerable<T> entities) {
            _dbSet.UpdateRange(entities);
            await _context.SaveChangesAsync();
            return entities;
        }

        // Delete entity by ID
        public virtual async Task<bool> DeleteAsync(int id) {
            var entity = await GetByIdAsync(id);
            if (entity == null)
                return false;

            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        // Delete entity by ID with generic key type
        public virtual async Task<bool> DeleteAsync<TKey>(TKey id) {
            var entity = await GetByIdAsync(id);
            if (entity == null)
                return false;

            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        // Delete entity
        public virtual async Task<bool> DeleteAsync(T entity) {
            if (entity == null)
                return false;

            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        // Delete multiple entities
        public virtual async Task<bool> DeleteRangeAsync(IEnumerable<T> entities) {
            if (entities == null || !entities.Any())
                return false;

            _dbSet.RemoveRange(entities);
            await _context.SaveChangesAsync();
            return true;
        }

        // Delete entities by condition
        public virtual async Task<int> DeleteAsync(Expression<Func<T, bool>> predicate) {
            var entities = await _dbSet.Where(predicate).ToListAsync();
            if (entities.Any()) {
                _dbSet.RemoveRange(entities);
                await _context.SaveChangesAsync();
            }
            return entities.Count;
        }

        // Save changes
        public virtual async Task<int> SaveChangesAsync() {
            return await _context.SaveChangesAsync();
        }
    }
}
