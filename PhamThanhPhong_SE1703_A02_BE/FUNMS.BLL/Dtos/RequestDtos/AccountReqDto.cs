using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNMS.BLL.Dtos.RequestDtos {
    public class AccountReqDto {
        [Required(ErrorMessage = "Account name is required")]
        public string? AccountName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string? AccountEmail { get; set; }

        [Required(ErrorMessage = "Role is required")]
        public int? AccountRole { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? AccountPassword { get; set; }
    }
}
