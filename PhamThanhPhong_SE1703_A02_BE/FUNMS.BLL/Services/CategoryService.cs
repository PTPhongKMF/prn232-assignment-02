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

namespace FUNMS.BLL.Services {
    public class CategoryService {
        private readonly CategoryRepository categoryRepository;
        private readonly IMapper mapper;

        public CategoryService(CategoryRepository categoryRepository, IMapper mapper) {
            this.categoryRepository = categoryRepository;
            this.mapper = mapper;
        }

        public IQueryable<CategoryDto> GetAllCategoriesAsQueryable() {
            return categoryRepository.GetAllCategoriesAsQueryable()
                .ProjectTo<CategoryDto>(mapper.ConfigurationProvider);
        }

        public async Task<ApiResponse<CategoryDto?>> GetCategoryById(short id) {
            var category = await categoryRepository.GetCategoryById(id);
            if (category == null) {
                return new ApiResponse<CategoryDto?>(404, "Category not found", null);
            }

            var categoryDto = mapper.Map<CategoryDto>(category);
            return new ApiResponse<CategoryDto?>(200, "Success", categoryDto);
        }

        public async Task<ApiResponse<CategoryDto?>> CreateCategory(CategoryReqDto categoryDto) {
            if (await categoryRepository.NameExists(categoryDto.CategoryName)) {
                return new ApiResponse<CategoryDto?>(400, "Category name already exists", null);
            }

            var category = mapper.Map<Category>(categoryDto);
            var result = await categoryRepository.AddAsync(category);
            
            var createdCategoryDto = mapper.Map<CategoryDto>(result);
            return new ApiResponse<CategoryDto?>(201, "Category created successfully", createdCategoryDto);
        }

        public async Task<ApiResponse<CategoryDto?>> UpdateCategory(short id, CategoryReqDto categoryDto) {
            var category = await categoryRepository.GetCategoryById(id);
            if (category == null) {
                return new ApiResponse<CategoryDto?>(404, "Category not found", null);
            }

            if (await categoryRepository.NameExists(categoryDto.CategoryName, id)) {
                return new ApiResponse<CategoryDto?>(400, "Category name already exists", null);
            }

            category.CategoryName = categoryDto.CategoryName;
            category.CategoryDesciption = categoryDto.CategoryDesciption;
            category.IsActive = categoryDto.IsActive;

            await categoryRepository.UpdateAsync(category);
            
            var updatedCategoryDto = mapper.Map<CategoryDto>(await categoryRepository.GetCategoryById(id));
            return new ApiResponse<CategoryDto?>(200, "Category updated successfully", updatedCategoryDto);
        }

        public async Task<ApiResponse<bool>> DeleteCategory(short id) {
            var category = await categoryRepository.GetCategoryById(id);
            if (category == null) {
                return new ApiResponse<bool>(404, "Category not found", false);
            }

            if (category.NewsArticles.Any()) {
                return new ApiResponse<bool>(400, "Cannot delete a category that has news articles", false);
            }

            await categoryRepository.DeleteAsync(category);
            return new ApiResponse<bool>(200, "Category deleted successfully", true);
        }
    }
}
