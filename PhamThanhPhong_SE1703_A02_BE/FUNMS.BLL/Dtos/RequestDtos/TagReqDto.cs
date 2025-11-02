using System;
using System.ComponentModel.DataAnnotations;

namespace FUNMS.BLL.Dtos.RequestDtos {
    public class TagReqDto {
        [Required(ErrorMessage = "Tag name is required")]
        public string TagName { get; set; } = null!;

        public string? Note { get; set; }
    }
}


