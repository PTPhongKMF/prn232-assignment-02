using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNMS.BLL.Dtos.ResponseDtos {
    public class TagDto {
        [Key]
        public int TagId { get; set; }
        public string? TagName { get; set; }
        public string? Note { get; set; }
    }
}
