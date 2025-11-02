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
    public class TagController : ODataController {
        private readonly TagService tagService;

        public TagController(TagService tagService) {
            this.tagService = tagService;
        }

        [HttpGet("tags")]
        [EnableQuery]
        [Authorize(Roles = "1,3")]
        public IActionResult GetAllTags() {
            return Ok(tagService.GetAllTagsAsQueryable());
        }

        [HttpGet("tags({id})")]
        [EnableQuery]
        [Authorize(Roles = "1,3")]
        public async Task<IActionResult> GetTagById([FromRoute] int id) {
            var result = await tagService.GetTagById(id);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost("tags")]
        [Authorize(Roles = "1,3")]
        public async Task<IActionResult> CreateTag([FromBody] TagReqDto tagDto) {
            var result = await tagService.CreateTag(tagDto);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPut("tags({id})")]
        [Authorize(Roles = "1,3")]
        public async Task<IActionResult> UpdateTag([FromRoute] int id, [FromBody] TagReqDto tagDto) {
            var result = await tagService.UpdateTag(id, tagDto);
            return StatusCode(result.StatusCode, result);
        }

        [HttpDelete("tags({id})")]
        [Authorize(Roles = "1,3")]
        public async Task<IActionResult> DeleteTag([FromRoute] int id) {
            var result = await tagService.DeleteTag(id);
            return StatusCode(result.StatusCode, result);
        }
    }
}
