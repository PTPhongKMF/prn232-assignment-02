using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using FUNMS.BLL.Dtos;
using FUNMS.BLL.Dtos.RequestDtos;
using FUNMS.BLL.Dtos.ResponseDtos;
using FUNMS.DAL.Entities;
using FUNMS.DAL.Repositories;

namespace FUNMS.BLL.Services {
    public class TagService {
        private readonly TagRepository tagRepository;
        private readonly IMapper mapper;

        public TagService(TagRepository tagRepository, IMapper mapper) {
            this.tagRepository = tagRepository;
            this.mapper = mapper;
        }

        public IQueryable<TagDto> GetAllTagsAsQueryable() {
            return tagRepository.GetAllTagsAsQueryable()
                .ProjectTo<TagDto>(mapper.ConfigurationProvider);
        }

        public async Task<ApiResponse<TagDto?>> GetTagById(int id) {
            var tag = await tagRepository.GetTagById(id);
            if (tag == null) {
                return new ApiResponse<TagDto?>(404, "Tag not found", null);
            }
            var dto = mapper.Map<TagDto>(tag);
            return new ApiResponse<TagDto?>(200, "Success", dto);
        }

        public async Task<ApiResponse<TagDto?>> CreateTag(TagReqDto tagDto) {
            if (await tagRepository.NameExists(tagDto.TagName)) {
                return new ApiResponse<TagDto?>(400, "Tag name already exists", null);
            }

            var tag = mapper.Map<Tag>(tagDto);
            var created = await tagRepository.AddAsync(tag);
            var dto = mapper.Map<TagDto>(created);
            return new ApiResponse<TagDto?>(201, "Tag created successfully", dto);
        }

        public async Task<ApiResponse<TagDto?>> UpdateTag(int id, TagReqDto tagDto) {
            var tag = await tagRepository.GetTagById(id);
            if (tag == null) {
                return new ApiResponse<TagDto?>(404, "Tag not found", null);
            }

            if (await tagRepository.NameExists(tagDto.TagName, id)) {
                return new ApiResponse<TagDto?>(400, "Tag name already exists", null);
            }

            tag.TagName = tagDto.TagName;
            tag.Note = tagDto.Note;
            await tagRepository.UpdateAsync(tag);

            var updated = await tagRepository.GetTagById(id);
            var dto = mapper.Map<TagDto>(updated);
            return new ApiResponse<TagDto?>(200, "Tag updated successfully", dto);
        }

        public async Task<ApiResponse<bool>> DeleteTag(int id) {
            var tag = await tagRepository.GetTagById(id);
            if (tag == null) {
                return new ApiResponse<bool>(404, "Tag not found", false);
            }

            if (tag.NewsArticles.Any()) {
                return new ApiResponse<bool>(400, "Cannot delete a tag that is used by news articles", false);
            }

            await tagRepository.DeleteAsync(tag);
            return new ApiResponse<bool>(200, "Tag deleted successfully", true);
        }
    }
}


