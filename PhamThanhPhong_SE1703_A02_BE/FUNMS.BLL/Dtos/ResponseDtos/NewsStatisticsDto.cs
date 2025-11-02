using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FUNMS.BLL.Dtos.ResponseDtos {
    public class NewsStatisticsDto {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int TotalNewsCount { get; set; }
        public int TotalAuthorsCount { get; set; }
        
        public List<NewsArticleDto> NewsList { get; set; } = new List<NewsArticleDto>();
        public List<AuthorStatsDto> AuthorStats { get; set; } = new List<AuthorStatsDto>();
        public List<CategoryStatsDto> CategoryStats { get; set; } = new List<CategoryStatsDto>();
        public List<TagStatsDto> TagStats { get; set; } = new List<TagStatsDto>();
    }
    
    public class AuthorStatsDto {
        public short AuthorId { get; set; }
        public string? AuthorName { get; set; }
        public int ArticleCount { get; set; }
    }
    
    public class CategoryStatsDto {
        public short CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public int ArticleCount { get; set; }
    }
    
    public class TagStatsDto {
        public int TagId { get; set; }
        public string? TagName { get; set; }
        public int ArticleCount { get; set; }
    }
}

