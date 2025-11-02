using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNMS.BLL.Dtos.RequestDtos {
    public class LoginDto {
        public string AccountEmail { get; set; }
        public string AccountPassword { get; set; }

    }
}
