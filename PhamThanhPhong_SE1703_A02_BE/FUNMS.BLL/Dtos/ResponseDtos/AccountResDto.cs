using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNMS.BLL.Dtos.ResponseDtos {
    public class AccountResDto {
        [Key]
        public short AccountId { get; set; }

        public string? AccountName { get; set; }

        public string? AccountEmail { get; set; }

        public int? AccountRole { get; set; }

        public string? Token { get; set; }

        public bool Deleteable { get; set; } = true;
    }
}
