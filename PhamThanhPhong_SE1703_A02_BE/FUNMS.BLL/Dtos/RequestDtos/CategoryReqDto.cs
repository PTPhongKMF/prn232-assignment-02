using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNMS.BLL.Dtos.RequestDtos {
    public class CategoryReqDto {
        [Required(ErrorMessage = "Category name is required")]
        public string CategoryName { get; set; } = null!;
        
        [Required(ErrorMessage = "Category description is required")]
        public string CategoryDesciption { get; set; } = null!;
        
        public bool? IsActive { get; set; } = true;
    }
}
