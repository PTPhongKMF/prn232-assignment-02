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
    public class CategoryController : ODataController {
        private readonly CategoryService categoryService;

        public CategoryController(CategoryService categoryService) {
            this.categoryService = categoryService;
        }

        [HttpGet("categories")]
        [EnableQuery]
        [Authorize(Roles = "1,3")]
        public IActionResult GetAllCategories() {
            return Ok(categoryService.GetAllCategoriesAsQueryable());
        }

        [HttpGet("categories({id})")]
        [EnableQuery]
        [Authorize(Roles = "1,3")]
        public async Task<IActionResult> GetCategoryById([FromRoute] short id) {
            var result = await categoryService.GetCategoryById(id);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost("categories")]
        [Authorize(Roles = "1,3")]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryReqDto categoryDto) {
            var result = await categoryService.CreateCategory(categoryDto);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPut("categories({id})")]
        [Authorize(Roles = "1,3")]
        public async Task<IActionResult> UpdateCategory([FromRoute] short id, [FromBody] CategoryReqDto categoryDto) {
            var result = await categoryService.UpdateCategory(id, categoryDto);
            return StatusCode(result.StatusCode, result);
        }

        [HttpDelete("categories({id})")]
        [Authorize(Roles = "1,3")]
        public async Task<IActionResult> DeleteCategory([FromRoute] short id) {
            var result = await categoryService.DeleteCategory(id);
            return StatusCode(result.StatusCode, result);
        }
    }
}
