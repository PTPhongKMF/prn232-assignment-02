using System.Security.Claims;
using FUNMS.BLL.Dtos;
using FUNMS.BLL.Dtos.RequestDtos;
using FUNMS.BLL.Dtos.ResponseDtos;
using FUNMS.BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace FUNMS.API.Controllers {

    [ApiController]
    [Route("/odata")]
    public class NewsController : ODataController {
        private readonly NewsService newsService;

        public NewsController(NewsService newsService) {
            this.newsService = newsService;
        }

        [HttpGet("newsarticles")]
        [EnableQuery]
        [Authorize(Roles = "1,3")]
        public IActionResult GetAllNewsArticles() {
            return Ok(newsService.GetAllNewsArticlesAsQueryable());
        }

        [HttpGet("publicnewsarticles")]
        [EnableQuery]
        public IActionResult GetAllPublicNewsArticles() {
            return Ok(newsService.GetAllPublicNewsArticlesAsQueryable());
        }

        [HttpGet("newsarticles({id})")]
        [EnableQuery]
        [Authorize(Roles = "1,3")]
        public async Task<IActionResult> GetNewsArticleById([FromRoute] int id) {
            var result = await newsService.GetNewsArticleById(id);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost("newsarticles")]
        [Authorize(Roles = "1,3")]
        public async Task<IActionResult> CreateNewsArticle([FromBody] NewsArticleReqDto newsArticleDto) {
             short createdById = short.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "1");
            
            var result = await newsService.CreateNewsArticle(newsArticleDto, createdById);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPut("newsarticles({id})")]
        [Authorize(Roles = "1,3")]
        public async Task<IActionResult> UpdateNewsArticle([FromRoute] int id, [FromBody] NewsArticleReqDto newsArticleDto) {
            short updatedById = short.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "1");
            
            var result = await newsService.UpdateNewsArticle(id, newsArticleDto, updatedById);
            return StatusCode(result.StatusCode, result);
        }

        [HttpDelete("newsarticles({id})")]
        [Authorize(Roles = "1,3")]
        public async Task<IActionResult> DeleteNewsArticle([FromRoute] int id) {
            var result = await newsService.DeleteNewsArticle(id);
            return StatusCode(result.StatusCode, result);
        }
        
        [HttpGet("newsstatistics")]
        [EnableQuery]
        [Authorize(Roles = "1,3")]
        public IActionResult GetNewsStatistics([FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null) {
            var result = newsService.GetNewsStatistics(startDate, endDate);
            return StatusCode(result.StatusCode, result);
        }
    }
}
