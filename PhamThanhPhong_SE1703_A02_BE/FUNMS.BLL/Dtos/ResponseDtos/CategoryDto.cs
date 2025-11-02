using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNMS.BLL.Dtos.ResponseDtos {
    public class CategoryDto {
        [Key]
        public short CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string CategoryDesciption { get; set; } = null!;
        public bool? IsActive { get; set; }
        public bool Deleteable { get; set; } = true;
    }
}
