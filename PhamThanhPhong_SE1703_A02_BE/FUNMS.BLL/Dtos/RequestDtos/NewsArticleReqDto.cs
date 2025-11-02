using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNMS.BLL.Dtos.RequestDtos {
    public class NewsArticleReqDto {
        [Required(ErrorMessage = "News title is required")]
        public string? NewsTitle { get; set; }

        [Required(ErrorMessage = "Headline is required")]
        public string? Headline { get; set; }
        
        public string? NewsContent { get; set; }
        
        public string? NewsSource { get; set; }
        
        [Required(ErrorMessage = "Category ID is required")]
        public short? CategoryId { get; set; }
        
        public bool? NewsStatus { get; set; } = true;
        
        public List<int>? TagIds { get; set; } = new List<int>();
    }
}
