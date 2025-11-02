using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNMS.BLL.Dtos.RequestDtos {
    public class ChangeInfoReqDto {
        public string? AccountName { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string? AccountEmail { get; set; }
    }
}
