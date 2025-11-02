using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using FUNMS.BLL.Dtos;
using FUNMS.BLL.Dtos.RequestDtos;
using FUNMS.BLL.Dtos.ResponseDtos;
using FUNMS.DAL.Entities;
using FUNMS.DAL.Repositories;
using Microsoft.EntityFrameworkCore;

namespace FUNMS.BLL.Services {
    public class AccountService {
        private readonly AccountRepository accountRepository;
        private readonly IMapper mapper;

        public AccountService(AccountRepository accountRepository, IMapper mapper) {
            this.accountRepository = accountRepository;
            this.mapper = mapper;
        }

        public async Task<ApiResponse<AccountResDto?>> Login(LoginDto login) {
            var acc = await accountRepository.Login(login.AccountEmail, login.AccountPassword);

            if (acc == null) {
                return new ApiResponse<AccountResDto?>(400, "Wrong email or password.", mapper.Map<AccountResDto>(acc));
            }

            return new ApiResponse<AccountResDto?>(200, "Success.", mapper.Map<AccountResDto>(acc));
        }
        
        public IQueryable<AccountWithPassResDto> GetAllAccountsAsQueryable() {
            return accountRepository.GetAllAccountsWithNewsArticlesAsQueryable()
                .ProjectTo<AccountWithPassResDto>(mapper.ConfigurationProvider);
        }

        public async Task<ApiResponse<AccountResDto?>> GetAccountById(short id) {
            var account = await accountRepository.GetAccountById(id);
            if (account == null) {
                return new ApiResponse<AccountResDto?>(404, "Account not found", null);
            }

            var accountDto = mapper.Map<AccountResDto>(account);
            return new ApiResponse<AccountResDto?>(200, "Success", accountDto);
        }

        public async Task<ApiResponse<AccountResDto?>> CreateAccount(AccountReqDto accountDto) {
            if (await accountRepository.EmailExists(accountDto.AccountEmail)) {
                return new ApiResponse<AccountResDto?>(400, "Email already exists", null);
            }

            var account = mapper.Map<SystemAccount>(accountDto);
            var result = await accountRepository.AddAsync(account);
            
            var createdAccountDto = mapper.Map<AccountResDto>(result);
            return new ApiResponse<AccountResDto?>(201, "Account created successfully", createdAccountDto);
        }

        public async Task<ApiResponse<AccountResDto?>> UpdateAccount(short id, AccountReqDto accountDto) {
            var account = await accountRepository.GetByIdAsync(id);
            if (account == null) {
                return new ApiResponse<AccountResDto?>(404, "Account not found", null);
            }

            if (await accountRepository.EmailExists(accountDto.AccountEmail, id)) {
                return new ApiResponse<AccountResDto?>(400, "Email already exists", null);
            }

            account.AccountName = accountDto.AccountName;
            account.AccountEmail = accountDto.AccountEmail;
            account.AccountRole = accountDto.AccountRole;
            
            if (!string.IsNullOrEmpty(accountDto.AccountPassword)) {
                account.AccountPassword = accountDto.AccountPassword;
            }

            await accountRepository.UpdateAsync(account);
            
            var updatedAccountDto = mapper.Map<AccountResDto>(await accountRepository.GetAccountById(id));
            return new ApiResponse<AccountResDto?>(200, "Account updated successfully", updatedAccountDto);
        }

        public async Task<ApiResponse<bool>> DeleteAccount(short id) {
            var account = await accountRepository.GetAccountById(id);
            if (account == null) {
                return new ApiResponse<bool>(404, "Account not found", false);
            }

            if (account.NewsArticles.Any()) {
                return new ApiResponse<bool>(400, "Cannot delete an account that has news articles", false);
            }

            await accountRepository.DeleteAsync(account);
            return new ApiResponse<bool>(200, "Account deleted successfully", true);
        }

        public async Task<ApiResponse<ProfileDto?>> GetUserProfile(short id) {
            var account = await accountRepository.GetByIdAsync(id);
            if (account == null) {
                return new ApiResponse<ProfileDto?>(404, "Account not found", null);
            }
            
            var profileDto = mapper.Map<ProfileDto>(account);
            return new ApiResponse<ProfileDto?>(200, "Success", profileDto);
        }

        public async Task<ApiResponse<bool>> ChangePassword(short userId, ChangePasswordReqDto req) {
            var account = await accountRepository.GetByIdAsync(userId);
            if (account == null) {
                return new ApiResponse<bool>(404, "Account not found", false);
            }

            if (!string.Equals(account.AccountPassword, req.CurrentPassword)) {
                return new ApiResponse<bool>(400, "Current password is incorrect", false);
            }

            account.AccountPassword = req.NewPassword;
            await accountRepository.UpdateAsync(account);

            return new ApiResponse<bool>(200, "Password changed successfully", true);
        }

        public async Task<ApiResponse<ProfileDto?>> UpdateMyInfo(short userId, ChangeInfoReqDto req) {
            var account = await accountRepository.GetByIdAsync(userId);
            if (account == null) {
                return new ApiResponse<ProfileDto?>(404, "Account not found", null);
            }

            if (!string.IsNullOrWhiteSpace(req.AccountEmail)) {
                if (await accountRepository.EmailExists(req.AccountEmail, userId)) {
                    return new ApiResponse<ProfileDto?>(400, "Email already exists", null);
                }
                account.AccountEmail = req.AccountEmail;
            }

            if (!string.IsNullOrWhiteSpace(req.AccountName)) {
                account.AccountName = req.AccountName;
            }

            await accountRepository.UpdateAsync(account);
            var profileDto = mapper.Map<ProfileDto>(account);
            return new ApiResponse<ProfileDto?>(200, "Profile updated successfully", profileDto);
        }
    }
}
