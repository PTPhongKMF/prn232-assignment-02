using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using FUNMS.BLL.Dtos;
using FUNMS.BLL.Dtos.RequestDtos;
using FUNMS.BLL.Dtos.ResponseDtos;
using FUNMS.DAL.Entities;
using FUNMS.DAL.Repositories;
using Microsoft.EntityFrameworkCore;

namespace FUNMS.BLL.Services {
    public class NewsService {
        private readonly NewsRepository newsRepository;
        private readonly IMapper mapper;

        public NewsService(NewsRepository newsRepository, IMapper mapper) {
            this.newsRepository = newsRepository;
            this.mapper = mapper;
        }

        public IQueryable<NewsArticleDto> GetAllNewsArticlesAsQueryable() {
            return newsRepository.GetAllNewsArticlesAsQueryable(false)
                .ProjectTo<NewsArticleDto>(mapper.ConfigurationProvider);
        }

        public IQueryable<NewsArticlePublicDto> GetAllPublicNewsArticlesAsQueryable() {
            return newsRepository.GetAllNewsArticlesAsQueryable(true)
                .ProjectTo<NewsArticlePublicDto>(mapper.ConfigurationProvider);
        }

        public async Task<ApiResponse<NewsArticleDto?>> GetNewsArticleById(int id) {
            var article = await newsRepository.GetNewsArticleById(id);
            if (article == null) {
                return new ApiResponse<NewsArticleDto?>(404, "News article not found", null);
            }

            var articleDto = mapper.Map<NewsArticleDto>(article);
            return new ApiResponse<NewsArticleDto?>(200, "Success", articleDto);
        }

        public async Task<ApiResponse<NewsArticleDto?>> CreateNewsArticle(NewsArticleReqDto newsArticleDto, short createdById) {
            var newsArticle = mapper.Map<NewsArticle>(newsArticleDto);
            
            newsArticle.CreatedDate = DateTime.Now;
            newsArticle.CreatedById = createdById;
            newsArticle.ModifiedDate = DateTime.Now;
            
            var result = await newsRepository.CreateNewsArticle(newsArticle, newsArticleDto.TagIds ?? new List<int>());
            
            var createdArticle = await newsRepository.GetNewsArticleById(result.NewsArticleId);
            var createdArticleDto = mapper.Map<NewsArticleDto>(createdArticle);
            
            return new ApiResponse<NewsArticleDto?>(201, "News article created successfully", createdArticleDto);
        }

        public async Task<ApiResponse<NewsArticleDto?>> UpdateNewsArticle(int id, NewsArticleReqDto newsArticleDto, short updatedById) {
            var existingArticle = await newsRepository.GetNewsArticleById(id);
            if (existingArticle == null) {
                return new ApiResponse<NewsArticleDto?>(404, "News article not found", null);
            }

            existingArticle.NewsTitle = newsArticleDto.NewsTitle;
            existingArticle.Headline = newsArticleDto.Headline;
            existingArticle.NewsContent = newsArticleDto.NewsContent;
            existingArticle.NewsSource = newsArticleDto.NewsSource;
            existingArticle.CategoryId = newsArticleDto.CategoryId;
            existingArticle.NewsStatus = newsArticleDto.NewsStatus;
            existingArticle.UpdatedById = updatedById;
            existingArticle.ModifiedDate = DateTime.Now;

            var updatedArticle = await newsRepository.UpdateNewsArticle(existingArticle, newsArticleDto.TagIds ?? new List<int>());
            if (updatedArticle == null) {
                return new ApiResponse<NewsArticleDto?>(500, "Failed to update news article", null);
            }
            
            var freshArticle = await newsRepository.GetNewsArticleById(id);
            var articleDto = mapper.Map<NewsArticleDto>(freshArticle);
            
            return new ApiResponse<NewsArticleDto?>(200, "News article updated successfully", articleDto);
        }

        public async Task<ApiResponse<bool>> DeleteNewsArticle(int id) {
            var existingArticle = await newsRepository.GetNewsArticleById(id);
            if (existingArticle == null) {
                return new ApiResponse<bool>(404, "News article not found", false);
            }

            var result = await newsRepository.DeleteNewsArticle(id);
            return new ApiResponse<bool>(result ? 200 : 500, 
                result ? "News article deleted successfully" : "Failed to delete news article", 
                result);
        }
        
        public ApiResponse<NewsStatisticsDto?> GetNewsStatistics(DateTime? startDate, DateTime? endDate) {
            if (startDate.HasValue && endDate.HasValue && endDate.Value < startDate.Value) {
                return new ApiResponse<NewsStatisticsDto?>(400, "End date cannot be earlier than start date", null);
            }
            
            var newsQuery = newsRepository.GetNewsStatistics(startDate, endDate);
            
            var newsList = newsQuery.ToList();
            var totalNewsCount = newsList.Count;
            
            var authorStats = newsList
                .Where(n => n.CreatedBy != null)
                .GroupBy(n => n.CreatedBy)
                .Select(g => new AuthorStatsDto {
                    AuthorId = g.Key.AccountId,
                    AuthorName = g.Key.AccountName,
                    ArticleCount = g.Count()
                })
                .OrderByDescending(a => a.ArticleCount)
                .ToList();
            
            var categoryStats = newsList
                .Where(n => n.Category != null)
                .GroupBy(n => n.Category)
                .Select(g => new CategoryStatsDto {
                    CategoryId = g.Key.CategoryId,
                    CategoryName = g.Key.CategoryName,
                    ArticleCount = g.Count()
                })
                .OrderByDescending(c => c.ArticleCount)
                .ToList();
            
            var tagStats = newsList
                .SelectMany(n => n.Tags)
                .GroupBy(t => t)
                .Select(g => new TagStatsDto {
                    TagId = g.Key.TagId,
                    TagName = g.Key.TagName,
                    ArticleCount = g.Count()
                })
                .OrderByDescending(t => t.ArticleCount)
                .ToList();
            
            var statistics = new NewsStatisticsDto {
                StartDate = startDate,
                EndDate = endDate,
                TotalNewsCount = totalNewsCount,
                TotalAuthorsCount = authorStats.Count,
                NewsList = mapper.Map<List<NewsArticleDto>>(newsList.OrderByDescending(n => n.CreatedDate).Take(10)),
                AuthorStats = authorStats,
                CategoryStats = categoryStats,
                TagStats = tagStats
            };
            
            return new ApiResponse<NewsStatisticsDto?>(200, "Success", statistics);
        }
    }
}
