using System.Security.Claims;
using FUNMS.API.Services;
using FUNMS.BLL.Dtos;
using FUNMS.BLL.Dtos.RequestDtos;
using FUNMS.BLL.Dtos.ResponseDtos;
using FUNMS.BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace FUNMS.API.Controllers {

    [ApiController]
    [Route("/odata")]
    public class AccountController : ODataController {
        private readonly AccountService accountService;
        private readonly IConfiguration configuration;
        private readonly JwtService jwtService;

        public AccountController(AccountService accountService, IConfiguration configuration, JwtService jwtService) {
            this.accountService = accountService;
            this.configuration = configuration;
            this.jwtService = jwtService;
        }

        [HttpPost("systemaccounts/login")]
        public async Task<IActionResult> Login([FromBody] LoginDto login) {
            var result = await accountService.Login(login);

            if (result.Data == null) {
                var adminAccount = configuration.GetSection("AdminAccount");
                if (login.AccountEmail.Equals(adminAccount["email"], StringComparison.OrdinalIgnoreCase)
                    && login.AccountPassword == adminAccount["password"]) {
                    var adminClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Email, adminAccount["email"]!),
                        new Claim(ClaimTypes.NameIdentifier, adminAccount["id"]!),
                        new Claim(ClaimTypes.Role, adminAccount["role"]!),
                    };

                    return StatusCode(200, new ApiResponse<object?>(200, "Success", new AccountResDto {
                        AccountId = adminAccount.GetValue<short>("id"),
                        AccountName = adminAccount["name"] ?? "",
                        AccountEmail = adminAccount["email"],
                        AccountRole = adminAccount.GetValue<int>("role"),
                        Token = jwtService.GenerateToken(adminClaims)
                    }));
                }

                return StatusCode(result.StatusCode, result);
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, result.Data.AccountEmail!),
                new Claim(ClaimTypes.NameIdentifier, result.Data.AccountId.ToString()),
                new Claim(ClaimTypes.Role, result.Data.AccountRole.ToString()!),
            };
            result.Data.Token = jwtService.GenerateToken(claims);

            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("systemaccounts")]
        [EnableQuery]
        [Authorize(Roles = "3")]
        public IActionResult GetAllAccounts() {
            return Ok(accountService.GetAllAccountsAsQueryable());
        }

        [HttpGet("systemaccounts({id})")]
        [EnableQuery]
        [Authorize(Roles = "3")]
        public async Task<IActionResult> GetAccountById([FromRoute] short id) {
            var result = await accountService.GetAccountById(id);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost("systemaccounts")]
        [Authorize(Roles = "3")]
        public async Task<IActionResult> CreateAccount([FromBody] AccountReqDto accountDto) {
            var result = await accountService.CreateAccount(accountDto);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPut("systemaccounts({id})")]
        [Authorize(Roles = "3")]
        public async Task<IActionResult> UpdateAccount([FromRoute] short id, [FromBody] AccountReqDto accountDto) {
            var result = await accountService.UpdateAccount(id, accountDto);
            return StatusCode(result.StatusCode, result);
        }

        [HttpDelete("systemaccounts({id})")]
        [Authorize(Roles = "3")]
        public async Task<IActionResult> DeleteAccount([FromRoute] short id) {
            var result = await accountService.DeleteAccount(id);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMe() {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            
            if (userIdClaim == null) {
                return StatusCode(401, new ApiResponse<object?>(401, "User ID not found in token", null));
            }
            
            short userId = short.Parse(userIdClaim.Value);
            int userRole = roleClaim != null ? int.Parse(roleClaim.Value) : 0;
            
            if (userRole == 3) {
                var adminAccount = configuration.GetSection("AdminAccount");
                var profileDto = new ProfileDto {
                    AccountId = adminAccount.GetValue<short>("id"),
                    AccountName = adminAccount["name"],
                    AccountEmail = adminAccount["email"],
                    AccountRole = adminAccount.GetValue<int>("role")
                };
                
                return StatusCode(200, new ApiResponse<ProfileDto?>(200, "Success", profileDto));
            }
            
            var result = await accountService.GetUserProfile(userId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPatch("me/password")]
        [Authorize]
        public async Task<IActionResult> ChangeMyPassword([FromBody] ChangePasswordReqDto req) {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirst(ClaimTypes.Role);

            if (userIdClaim == null) {
                return StatusCode(401, new ApiResponse<object?>(401, "User ID not found in token", null));
            }

            if (roleClaim != null && int.TryParse(roleClaim.Value, out var roleVal) && roleVal == 3) {
                return StatusCode(400, new ApiResponse<object?>(400, "Admin password cannot be changed via API", null));
            }

            short userId = short.Parse(userIdClaim.Value);
            var result = await accountService.ChangePassword(userId, req);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPatch("me/info")]
        [Authorize]
        public async Task<IActionResult> UpdateMyInfo([FromBody] ChangeInfoReqDto req) {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirst(ClaimTypes.Role);

            if (userIdClaim == null) {
                return StatusCode(401, new ApiResponse<object?>(401, "User ID not found in token", null));
            }

            if (roleClaim != null && int.TryParse(roleClaim.Value, out var roleVal) && roleVal == 3) {
                return StatusCode(400, new ApiResponse<object?>(400, "Admin profile cannot be changed via API", null));
            }

            short userId = short.Parse(userIdClaim.Value);
            var result = await accountService.UpdateMyInfo(userId, req);
            return StatusCode(result.StatusCode, result);
        }
    }
}
