using AutoMapper;
using FUNMS.BLL.Dtos.RequestDtos;
using FUNMS.BLL.Dtos.ResponseDtos;
using FUNMS.DAL.Entities;

namespace FUNMS.BLL {
    public class AutoMapperConfig : Profile {
        public AutoMapperConfig() {
            // Account mappings
            CreateMap<SystemAccount, AccountResDto>()
                .ForMember(dest => dest.Deleteable, opt => opt.MapFrom(src => !src.NewsArticles.Any()));
            
            CreateMap<SystemAccount, ProfileDto>();
            CreateMap<SystemAccount, AccountWithPassResDto>()
                .ForMember(dest => dest.Deleteable, opt => opt.MapFrom(src => !src.NewsArticles.Any()));

            CreateMap<AccountReqDto, SystemAccount>();

            // News Article mappings
            CreateMap<NewsArticle, NewsArticleDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.CategoryName : null))
                .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.CreatedBy != null ? src.CreatedBy.AccountName : null));
            CreateMap<NewsArticle, NewsArticlePublicDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.CategoryName : null))
                .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.CreatedBy != null ? src.CreatedBy.AccountName : null));
            
            CreateMap<NewsArticleReqDto, NewsArticle>();
            
            // Tag and Category mappings
            CreateMap<Tag, TagDto>();
            CreateMap<TagReqDto, Tag>();
            CreateMap<Category, CategoryDto>()
                .ForMember(dest => dest.Deleteable, opt => 
                    opt.MapFrom(src => !src.NewsArticles.Any()));
            
            CreateMap<CategoryReqDto, Category>();
        }
    }
}
