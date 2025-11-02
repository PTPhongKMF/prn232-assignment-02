using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FUNMS.BLL.Dtos.ResponseDtos {
    public class NewsArticlePublicDto {
        [Key]
        public int NewsArticleId { get; set; }
        public string? NewsTitle { get; set; }
        public string? Headline { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? NewsContent { get; set; }
        public string? NewsSource { get; set; }
        public DateTime? ModifiedDate { get; set; }

        public short? CategoryId { get; set; }
        public string? CategoryName { get; set; }

        public short? CreatedById { get; set; }
        public string? AuthorName { get; set; }

        public ICollection<TagDto> Tags { get; set; } = new List<TagDto>();
    }
}


