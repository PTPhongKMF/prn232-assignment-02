using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FUNMS.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace FUNMS.DAL.Repositories {
    public class AccountRepository : GenericRepository<SystemAccount> {
        public AccountRepository(FunewsManagementContext context) : base(context) {
        }

        public async Task<SystemAccount?> Login(string e, string p) {
            return await GetFirstOrDefaultAsync(a => a.AccountEmail == e && a.AccountPassword == p);
        }

        public IQueryable<SystemAccount> GetAllAccountsWithNewsArticlesAsQueryable() {
            return _context.SystemAccounts
                .Include(a => a.NewsArticles);
        }

        public async Task<SystemAccount?> GetAccountById(short id) {
            return await _context.SystemAccounts
                .Include(a => a.NewsArticles)
                .FirstOrDefaultAsync(a => a.AccountId == id);
        }

        public async Task<bool> EmailExists(string email, short? excludeId = null) {
            var query = _context.SystemAccounts.Where(a => a.AccountEmail == email);

            if (excludeId.HasValue) {
                query = query.Where(a => a.AccountId != excludeId.Value);
            }

            return await query.AnyAsync();
        }

    }
}
